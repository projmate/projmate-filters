##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

_     = require("lodash")
async = require('async')
fs    = require('fs')
Path = require('path')


# Gets the number of lines in `s`
#
numberOfLines = (s) ->
  matches = s.match(/(\r|\n)/g)
  # last line doesn't have a \n
  matches.length + 1


module.exports = (Projmate) ->
  {TaskProcessor, Utils} = Projmate
  SourceMap = require("../support/sourceMap")

  # Reduces a task's assets into a single browser-side CommonJS-like module asset.
  #
  # Script is mostly [stitch](https://github.com/sstephenson/stitch.git) with
  # added support for modules.
  #
  class CommonJsify extends TaskProcessor
    extnames: ".js"

    constructor: ->
      @extnames = ".js"
      @defaults =
        development: {sourceMap: true}
        production: {sourceMap: false}

      super

    process: (task, options, cb) ->
      identifier = options.identifier || "require"
      assets = task.assets.array()
      packageName = options.packageName || "app"
      baseDir = Utils.unixPath(options.baseDir)
      sourceMap = options.sourceMap

      return cb("`options.baseDir` is required.") unless baseDir

      result = """
        (function() {
          if (!this.#{identifier}) {
            var modules = {}, packages = {}, cache = {},

            require = function(name, root) {
              var path = expand(root, name), module = cache[path], fn;
              if (module) {
                return module;
              } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
                module = {id: name, exports: {}};
                try {
                  cache[path] = module.exports;

                  //=> fn(exports, require, module, __filename, __dirname)
                  fn(module.exports, function(name) {
                    return require(name, dirname(path));
                  }, module, path, dirname(path));

                  return cache[path] = module.exports;
                } catch (err) {
                  delete cache[path];
                  throw err;
                }
              } else {
                throw 'module \\'' + name + '\\' not found';
              }
            },

            expand = function(root, name) {
              var results = [], parts, part;
              if (/^\\.\\.?(\\/|$)/.test(name)) {
                parts = [root, name].join('/').split('/');
              } else {
                parts = name.split('/');
              }
              for (var i = 0, length = parts.length; i < length; i++) {
                part = parts[i];
                if (part == '..') {
                  results.pop();
                } else if (part != '.' && part != '') {
                  results.push(part);
                }
              }
              return results.join('/');
            },

            dirname = function(path) {
              return path.split('/').slice(0, -1).join('/');
            };

            this.#{identifier} = function(name) {
              return require(name, '');
            }
            this.#{identifier}.define = function(bundle, package) {
              if (!package) {
                package = "stitch";
              }
              if (packages[package]) {
                throw "Stitch - Package already defined '"+package+"'";
              }

              for (var key in bundle)
                modules[package+"/"+key] = bundle[key];
            };
          }
          return this.#{identifier}.define;
        }).call(this)({
      """

      index = 0
      for asset  in assets
        {dirname, basename, extname, text} = asset
        continue if extname == ".map"

        # path is used as the key since it is not on the filesystem
        path = Utils.unixPath(Path.join(dirname, Path.basename(basename, extname)))
        # make relative to baseDir
        if options.baseDir
          baseDir = Utils.rensure(options.baseDir, '/')
          path = Utils.lchomp(path, baseDir)

        result += if index++ is 0 then "" else ", "
        result += JSON.stringify(path)
        result += ": function(exports, require, module, __filename, __dirname) {\n"

        # track where this asset was inserted to adjust the source maps (if any later)
        asset.sourceMapOffset = numberOfLines(result) - 1
        text = text.replace(/^\/\/@ sourceMappingURL.*$/gm, "")

        # asset is merged into a combined asset so mark it for delete and it
        # will get swept in @mapAsset
        asset.markDelete = true

        result += "#{text}\n}"

      result += """
        }, '#{packageName}');\n
      """
      @mapAssets task, options, result
      cb null


    ##
    # All assets were combined into a single asset. Update the task's asset property
    # to reflect a single asset using filename from `options.filename`.
    mapAssets: (task, options, script) ->

      if options.sourceMap

        # The combined script needs this line for browsers and IDEs
        script += """
        /*
        //@ sourceMappingURL=#{Utils.changeExtname(Path.basename(options.filename), ".map")}
        */
        """

        # Remap all individual source maps into a single source map using the
        # offsets collected above
        generator = SourceMap.createGenerator(options.filename)

        for asset in task.assets.array()
          if asset.sourceMapOffset?
            mapFilename = Utils.changeExtname(asset.filename, ".map")
            mapAsset = task.assets.detect (map) -> map.filename == mapFilename
            if mapAsset
              json = mapAsset.text
              mapAsset.markDelete = true
            else
              unmappedGenerator = SourceMap.createGenerator(asset.filename)
              unmappedGenerator.setSourceContent(asset.basename, asset.text)
              json = unmappedGenerator.toJSON()

            source = Utils.lchomp(asset.originalFilename, options.baseDir)
            source = Utils.lchomp(source, "/")

            SourceMap.rebase generator, json, source, asset.sourceMapOffset

        # create the sourcemap asset
        mapAsset = task.assets.create
          filename: Utils.changeExtname(options.filename, ".map")
          text: generator.toJSON()

        # wait until the asset is beign written to change the file
        mapAsset.whenWriting ->
          sourceRoot = Path.relative(mapAsset.dirname, options.baseDir)
          mapAsset.text.sourceRoot = sourceRoot
          mapAsset.text.file = Utils.changeExtname(mapAsset.basename, ".js")
          mapAsset.text = JSON.stringify(mapAsset.text)


      # keep everything but JavaScript files which were merged above and written below
      task.assets.removeAssets (asset) -> asset.markDelete

      # create the CommonJS module
      asset = task.assets.create
        filename: options.filename
        text: script

