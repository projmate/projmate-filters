##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

_     = require("lodash")
async = require('async')
fs    = require('fs')
Path = require("path")


module.exports = (Projmate) ->
  {TaskProcessor, Utils} = Projmate

  # Reduces a task's assets into a single browser-side CommonJS-like module asset.
  #
  # Script is mostly [stitch](https://github.com/sstephenson/stitch.git) with
  # added support for modules.
  #
  class CommonJsify extends TaskProcessor
    extnames: "*"
    constructor: ->
      super

    process: (task, options, cb) ->
      identifier = options.identifier || "require"
      assets = task.assets
      packageName = options.packageName || "app"
      baseDir = Utils.unixPath(options.baseDir)

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
      for {dirname, basename, extname, text} in assets
        # path is used as the key since it is not on the filesystem
        path = Utils.unixPath(Path.join(dirname, Path.basename(basename, extname)))
        # make relative to baseDir
        if options.baseDir
          baseDir = Utils.rensure(options.baseDir, '/')
          path = Utils.lchomp(path, baseDir)

        result += if index++ is 0 then "" else ", "
        result += JSON.stringify(path)
        result += ": function(exports, require, module, __filename, __dirname) {#{text}}"

      result += """
        }, '#{packageName}');\n
      """

      @reduceAssets task, options, result
      cb null


    ##
    # All assets were combined into a single asset. Update the task's asset property
    # to reflect a single asset using filename from `options.filename`.
    reduceAssets: (task, options, script) ->
      task.assets.clear()
      task.assets.create filename: options.filename, text: script


