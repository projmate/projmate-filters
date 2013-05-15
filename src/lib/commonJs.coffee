##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require("path")
UglifyJS = require("uglify-js")
Async = require('async')
Fs = require('fs')


# Gets the number of lines in `s`
#
numberOfLines = (s) ->
  matches = s.match(/(\r|\n)/g)
  # last line doesn't have a \n
  matches.length + 1


moduleSignature = (simplifiedCjs) ->
  if simplifiedCjs
    "req, module.exports, module, path, dirname(path)"
  else
    "module.exports, req, module, path, dirname(path)"


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


    genLoader: (options, requireProp, defineProp) ->
      if options.DEVELOPMENT
        diagnostics = """
          _require.modules = function() { return modules; };
          _require.cache = function() { return cache; };
        """
      else
        diagnostics = ""

      signature =
        if options.simplifiedCjs
          "req, module.exports, module, path, dirname(path)"
        else
          "module.exports, req, module, path, dirname(path)"

      result = """
        (function(root) {
          if (!root.#{requireProp}) {
            var modules = {}, cache = {};

            function dirname(path) {
              return path.split('/').slice(0, -1).join('/');
            }

            function expand(root, name) {
              var results = [], parts, part;
              if (/^\\.\\.?(\\/|$)/.test(name)) {
                parts = [root, name].join('/').split('/');
              } else {
                parts = name.split('/');
              }
              for (var i = 0, length = parts.length; i < length; i++) {
                part = parts[i];
                if (part === '..') {
                  results.pop();
                } else if (part !== '.' && part !== '') {
                  results.push(part);
                }
              }
              return results.join('/');
            }

            function require(name, root) {
              var path = expand(root, name), module = cache[path], fn;
              if (module) return module;

              if (fn = modules[path] || modules[path = expand(path, './index')]) {
                module = {id: path, exports: {}};
                try {
                  cache[path] = module.exports;
                  function req(name) {
                    return require(name, dirname(path));
                  }
                  fn(#{signature});
                  return cache[path] = module.exports;
                } catch (err) {
                  delete cache[path];
                  throw err;
                }
              } else {
                throw 'module \\'' + name + '\\' not found';
              }
            }

            function _require(name) {
              return require(name, '');
            };
            _require.resolve = function(path) {
              return expand('', name);
            };

            #{diagnostics}

            function _define(path, deps, mod) {
              if (arguments.length === 2) {
                mod = deps;
                deps = [];
              };
              modules[path] = mod;
            };
          }

          root.#{requireProp} = _require;
          root.#{defineProp} = _define;
        })(this);
      """


    includeFiles: (options, Utils, cb) ->
      files = options.include
      cwd = process.cwd()
      patterns = files.include
      excludePatterns = files.exclude
      result = ""

      Utils.glob patterns, excludePatterns, {nosort: true}, (err, files) ->
        return cb(err) if err

        if files.length > 0
          for file in files
            stat = Fs.statSync(file)
            continue if stat.isDirectory()
            content = Fs.readFileSync(file, 'utf8')
            result += "(function(){#{content}})();"

        return cb(null, result)

    includeAliases: (options, Utils, cb) ->
      {defineProp, aliases} = options
      result = ""
      for alias, file of aliases
        console.log "ALIAS", alias, "FILE", file
        stat = Fs.statSync(file)
        continue unless stat.isFile()
        content = Fs.readFileSync(file, 'utf8')
        result += "(function(define) {"
        signature =
          if options.simplifiedCjs
            "require, exports, module, __filename, __dirname"
          else
            "exports, require, module, __filename, __dirname"

        #=> define('some/path', function(require, exports, module) {
        result += "#{defineProp}('#{alias}', function(#{signature}) {\n"
        result += "#{content}\n});"
        result += "})(this.#{defineProp});"
      return cb(null, result)


    process: (task, options, cb) ->
      requireProp = options.requireProp || options.identifier || "require"
      options.defineProp ?= "define"
      defineProp = options.defineProp

      options.loader ?= true
      options.simplifiedCjs ?= false
      options.splitFiles ?= false

      loader = options.loader
      simplifiedCjs = options.simplifiedCjs

      assets = task.assets.array()
      packageName = options.packageName || options.name || "app"
      options.root = Utils.unixPath(options.root || options.baseDir)
      sourceMap = options.sourceMap
      options.auto = options.auto || options.autoRequire

      return cb("`options.root` is required.") unless options.root
      options.filename ?= Path.dirname(options.root) + '/' + options.name + '.js'

      result = ";"
      that = @

      doLoader = (cb) ->
        if loader
          result += that.genLoader(options, requireProp, defineProp)
        cb()


      doIncludes = (cb) ->
        return cb() unless options.include

        Utils.normalizeFiles options, 'include'
        that.includeFiles options, Utils, (err, text) ->
          return cb(err) if err
          result += text
          cb()

      # allows files to register themselves
      doAliases = (cb) ->
        return cb() unless options.aliases

        that.includeAliases options, Utils, (err, text) ->
          return cb(err) if err
          result += text
          cb()


      doBody = (cb) ->

        result += "(function(define) {"

        for asset  in assets
          {dirname, basename, extname, text, originalFilename} = asset
          continue if extname == ".map"

          # path is used as the key since it is not on the filesystem
          path = Utils.unixPath(Path.join(dirname, Path.basename(basename, extname)))

          # make relative to root
          if options.root
            root = Utils.rensure(options.root, '/')
            path = Utils.lchomp(path, root)

          packagePath = JSON.stringify(packageName + '/' + path)

          signature =
            if options.simplifiedCjs
              "require, exports, module, __filename, __dirname"
            else
              "exports, require, module, __filename, __dirname"


          #=> define('some/path', function(require, exports, module) {
          result += "#{defineProp}(#{packagePath}, function(#{signature}) {\n"

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
              that.log.error "#{asset.filename}"
              return cb(err)
          else
            # don't need the original mapping line
            text = text.replace(/^\/\/@ sourceMappingURL.*$/gm, "")

          # asset is merged into a combined asset so mark it for delete and it
          # will get swept in @mapAsset
          asset.markDelete = true

          result += "#{text}\n});"

        result += "})(this.#{defineProp});"
        if options.auto
          if options.auto[0] == '.'
            # ./module => module/module
            autoModule = options.auto.replace(/^\./, packageName)
          else
            # module => module/module
            autoModule = "#{packageName}/#{options.auto}"

          result += """
            (function(#{requireProp}) {
              #{requireProp}('#{autoModule}')
            })(this.#{requireProp});
          """

        that.mapAssets task, options, result
        cb null

      Async.series [doLoader, doIncludes, doAliases, doBody], cb




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

