##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require("path")
UglifyJS = require("uglify-js")


# Gets the number of lines in `s`
#
numberOfLines = (s) ->
  matches = s.match(/(\r|\n)/g)
  # last line doesn't have a \n
  matches.length + 1


module.exports = (Projmate) ->
  {TaskProcessor, Utils} = Projmate
  {changeExtname} = Utils
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
        development: {sourceMap: false}
        production: {sourceMap: false}
      super

    process: (task, options, cb) ->
      identifier = options.identifier || "require"
      assets = task.assets.array()
      packageName = options.packageName || options.name || "app"
      options.root = Utils.unixPath(options.root || options.baseDir)
      sourceMap = options.sourceMap
      options.auto = options.auto || options.autoRequire

      return cb("`options.root` is required.") unless options.root
      options.filename ?= Path.dirname(options.root) + '/' + options.name + '.js'

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

            var __require = function(name) {
              return require(name, '');
            };

            __require.define = function(bundle, package) {
              if (packages[package]) {
                throw "Package already defined '"+package+"'";
              }
              for (var key in bundle) {
                modules[package+"/"+key] = bundle[key];
              }
            };
          }

          this.#{identifier} = __require;
          return __require.define;
        }).call(this)({
      """

      index = 0
      for asset  in assets
        {dirname, basename, extname, text} = asset
        continue if extname == ".map"

        # path is used as the key since it is not on the filesystem
        path = Utils.unixPath(Path.join(dirname, Path.basename(basename, extname)))

        # make relative to root
        if options.root
          root = Utils.rensure(options.root, '/')
          path = Utils.lchomp(path, root)

        result += if index++ is 0 then "" else ", "
        result += JSON.stringify(path)
        result += ": function(exports, require, module, __filename, __dirname) {\n"

        # track where this asset was inserted to adjust the source maps (if any later)
        asset.sourceMapOffset = numberOfLines(result) - 1

        if options.sourceMap and asset.originalFilename.match(/\.js$/)
          try
            # create map file for JS files
            ugly = UglifyJS.minify asset.text,
              fromString: true
              compress: false
              mangle: false
              outSourceMap: changeExtname(asset.basename, ".map")
            # create generated map file
            asset.parent.create filename: changeExtname(asset.filename, ".map"), text:  ugly.map
            text = ugly.code
          catch err
            @log.error "#{asset.filename}"
            return cb(err)
        else
          # don't need the original mapping line
          text = text.replace(/^\/\/@ sourceMappingURL.*$/gm, "")

        # asset is merged into a combined asset so mark it for delete and it
        # will get swept in @mapAsset
        asset.markDelete = true

        result += "#{text}\n}"

      result += """
        }, '#{packageName}');\n
      """

      if options.auto
        if options.auto[0] == '.'
          # ./module => module/module
          autorun = options.auto.replace(/^\./, packageName)
        else
          # module => module/module
          autorun = "#{packageName}/#{options.auto}"

        result += """
          (function() {
            #{identifier}('#{autorun}')
          })();
        """

      @mapAssets task, options, result
      cb null


    ##
    # All assets were combined into a single asset. Update the task's asset property
    # to reflect a single asset using filename from `options.filename`.
    mapAssets: (task, options, script) ->
      if options.sourceMap
        sourceRoot = options.sourceRoot

        # The combined script needs this line for browsers and IDEs
        script += """
        /*
        //@ sourceMappingURL=#{changeExtname(Path.basename(options.filename), ".map")}
        */
        """

        # Remap all individual source maps into a single source map using the
        # offsets collected above
        generator = SourceMap.createGenerator(options.filename)

        for asset in task.assets.array()
          if asset.sourceMapOffset?
            mapFilename = changeExtname(asset.filename, ".map")
            mapAsset = task.assets.detect (map) -> map.filename == mapFilename
            if mapAsset
              json = mapAsset.text
              mapAsset.markDelete = true

              source = Utils.lchomp(asset.originalFilename, options.root)
              source = Utils.lchomp(source, "/")

              SourceMap.rebase generator, json, source, asset.sourceMapOffset

        # create the sourcemap asset
        mapAsset = task.assets.create
          filename: changeExtname(options.filename, ".map")
          text: ''
          __map: generator.toJSON()

        # write paths are not known until the WriteFile filter is about to write
        mapAsset.whenWriting ->
          # SourceRoot should be overriden in the case relative paths traverse
          # into directories not served by the server. For example, static files
          # may be served from public/ but relative paths may resolve to src/.
          unless sourceRoot
            sourceRoot = Utils.unixPath(Path.relative(mapAsset.dirname, options.root))
          mapAsset.__map.sourceRoot = sourceRoot
          mapAsset.__map.file = changeExtname(mapAsset.basename, ".js")
          mapAsset.text = JSON.stringify(mapAsset.__map)
          delete mapAsset.__map

      # keep everything but JavaScript files which were merged above and written below
      task.assets.removeAssets (asset) -> asset.markDelete

      # create the CommonJS module
      asset = task.assets.create
        filename: options.filename
        text: script

