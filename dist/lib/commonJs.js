/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Async, Fs, Path, UglifyJS, moduleSignature, numberOfLines,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Path = require("path");

UglifyJS = require("uglify-js");

Async = require('async');

Fs = require('fs');

numberOfLines = function(s) {
  var matches;

  matches = s.match(/(\r|\n)/g);
  return matches.length + 1;
};

moduleSignature = function(simplifiedCjs) {
  if (simplifiedCjs) {
    return "req, module.exports, module, path, dirname(path)";
  } else {
    return "module.exports, req, module, path, dirname(path)";
  }
};

module.exports = function(Projmate) {
  var CommonJsify, SourceMap, TaskProcessor, Utils, changeExtname;

  TaskProcessor = Projmate.TaskProcessor, Utils = Projmate.Utils;
  changeExtname = Utils.changeExtname;
  SourceMap = require("../support/sourceMap");
  return CommonJsify = (function(_super) {
    __extends(CommonJsify, _super);

    CommonJsify.prototype.extnames = ".js";

    function CommonJsify() {
      this.extnames = ".js";
      this.defaults = {
        development: {
          sourceMap: false
        },
        production: {
          sourceMap: false
        }
      };
      CommonJsify.__super__.constructor.apply(this, arguments);
    }

    CommonJsify.prototype.genLoader = function(options, requireProp, defineProp) {
      var diagnostics, result, signature;

      if (options.DEVELOPMENT) {
        diagnostics = "_require.modules = function() { return modules; };\n_require.cache = function() { return cache; };";
      } else {
        diagnostics = "";
      }
      signature = options.simplifiedCjs ? "req, module.exports, module, path, dirname(path)" : "module.exports, req, module, path, dirname(path)";
      return result = "(function(root) {\n  if (!root." + requireProp + ") {\n    var modules = {}, cache = {};\n\n    function dirname(path) {\n      return path.split('/').slice(0, -1).join('/');\n    }\n\n    function expand(root, name) {\n      var results = [], parts, part;\n      if (/^\\.\\.?(\\/|$)/.test(name)) {\n        parts = [root, name].join('/').split('/');\n      } else {\n        parts = name.split('/');\n      }\n      for (var i = 0, length = parts.length; i < length; i++) {\n        part = parts[i];\n        if (part === '..') {\n          results.pop();\n        } else if (part !== '.' && part !== '') {\n          results.push(part);\n        }\n      }\n      return results.join('/');\n    }\n\n    function require(name, root) {\n      var path = expand(root, name), module = cache[path], fn;\n      if (module) return module;\n\n      if (fn = modules[path] || modules[path = expand(path, './index')]) {\n        module = {id: path, exports: {}};\n        try {\n          cache[path] = module.exports;\n          function req(name) {\n            return require(name, dirname(path));\n          }\n          fn(" + signature + ");\n          return cache[path] = module.exports;\n        } catch (err) {\n          delete cache[path];\n          throw err;\n        }\n      } else {\n        throw 'module \\'' + name + '\\' not found';\n      }\n    }\n\n    function _require(name) {\n      return require(name, '');\n    };\n    _require.resolve = function(path) {\n      return expand('', name);\n    };\n\n    " + diagnostics + "\n\n    function _define(path, deps, mod) {\n      if (arguments.length === 2) {\n        mod = deps;\n        deps = [];\n      };\n      modules[path] = mod;\n    };\n\n    root." + requireProp + " = _require;\n    root." + defineProp + " = _define;\n  }\n\n})(this);";
    };

    CommonJsify.prototype.includeFiles = function(options, Utils, cb) {
      var cwd, excludePatterns, files, patterns, result;

      files = options.include;
      cwd = process.cwd();
      patterns = files.include;
      excludePatterns = files.exclude;
      result = "";
      return Utils.glob(patterns, excludePatterns, {
        nosort: true
      }, function(err, files) {
        var content, file, stat, _i, _len;

        if (err) {
          return cb(err);
        }
        if (files.length > 0) {
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            stat = Fs.statSync(file);
            if (stat.isDirectory()) {
              continue;
            }
            content = Fs.readFileSync(file, 'utf8');
            result += "(function(){" + content + "})();";
          }
        }
        return cb(null, result);
      });
    };

    CommonJsify.prototype.includeAliases = function(options, Utils, cb) {
      var alias, aliases, content, defineProp, file, result, signature, stat;

      defineProp = options.defineProp, aliases = options.aliases;
      result = "";
      for (alias in aliases) {
        file = aliases[alias];
        console.log("ALIAS", alias, "FILE", file);
        stat = Fs.statSync(file);
        if (!stat.isFile()) {
          continue;
        }
        content = Fs.readFileSync(file, 'utf8');
        result += "(function(define) {";
        signature = options.simplifiedCjs ? "require, exports, module, __filename, __dirname" : "exports, require, module, __filename, __dirname";
        result += "" + defineProp + "('" + alias + "', function(" + signature + ") {\n";
        result += "" + content + "\n});";
        result += "})(this." + defineProp + ");";
      }
      return cb(null, result);
    };

    CommonJsify.prototype.process = function(task, options, cb) {
      var assets, defineProp, doAliases, doBody, doIncludes, doLoader, loader, packageName, requireProp, result, simplifiedCjs, sourceMap, that, _ref, _ref1, _ref2, _ref3, _ref4;

      requireProp = options.requireProp || options.identifier || "require";
      if ((_ref = options.defineProp) == null) {
        options.defineProp = "define";
      }
      defineProp = options.defineProp;
      if ((_ref1 = options.loader) == null) {
        options.loader = true;
      }
      if ((_ref2 = options.simplifiedCjs) == null) {
        options.simplifiedCjs = false;
      }
      if ((_ref3 = options.splitFiles) == null) {
        options.splitFiles = false;
      }
      loader = options.loader;
      simplifiedCjs = options.simplifiedCjs;
      assets = task.assets.array();
      packageName = options.packageName || options.name || "app";
      options.root = Utils.unixPath(options.root || options.baseDir);
      sourceMap = options.sourceMap;
      options.auto = options.auto || options.autoRequire;
      if (!options.root) {
        return cb("`options.root` is required.");
      }
      if ((_ref4 = options.filename) == null) {
        options.filename = Path.dirname(options.root) + '/' + options.name + '.js';
      }
      result = ";";
      that = this;
      doLoader = function(cb) {
        if (loader) {
          result += that.genLoader(options, requireProp, defineProp);
        }
        return cb();
      };
      doIncludes = function(cb) {
        if (!options.include) {
          return cb();
        }
        Utils.normalizeFiles(options, 'include');
        return that.includeFiles(options, Utils, function(err, text) {
          if (err) {
            return cb(err);
          }
          result += text;
          return cb();
        });
      };
      doAliases = function(cb) {
        if (!options.aliases) {
          return cb();
        }
        return that.includeAliases(options, Utils, function(err, text) {
          if (err) {
            return cb(err);
          }
          result += text;
          return cb();
        });
      };
      doBody = function(cb) {
        var asset, autoModule, basename, dirname, err, extname, originalFilename, packagePath, path, root, signature, text, ugly, _i, _len;

        result += "(function(define) {";
        for (_i = 0, _len = assets.length; _i < _len; _i++) {
          asset = assets[_i];
          dirname = asset.dirname, basename = asset.basename, extname = asset.extname, text = asset.text, originalFilename = asset.originalFilename;
          if (extname === ".map") {
            continue;
          }
          path = Utils.unixPath(Path.join(dirname, Path.basename(basename, extname)));
          if (options.root) {
            root = Utils.rensure(options.root, '/');
            path = Utils.lchomp(path, root);
          }
          packagePath = JSON.stringify(packageName + '/' + path);
          signature = options.simplifiedCjs ? "require, exports, module, __filename, __dirname" : "exports, require, module, __filename, __dirname";
          result += "" + defineProp + "(" + packagePath + ", function(" + signature + ") {\n";
          asset.sourceMapOffset = numberOfLines(result) - 1;
          if (options.sourceMap && asset.originalFilename.match(/\.js$/)) {
            try {
              ugly = UglifyJS.minify(asset.text, {
                fromString: true,
                compress: false,
                mangle: false,
                outSourceMap: changeExtname(asset.basename, ".map")
              });
              asset.parent.create({
                filename: changeExtname(asset.filename, ".map"),
                text: ugly.map
              });
              text = ugly.code;
            } catch (_error) {
              err = _error;
              that.log.error("" + asset.filename);
              return cb(err);
            }
          } else {
            text = text.replace(/^\/\/@ sourceMappingURL.*$/gm, "");
          }
          asset.markDelete = true;
          result += "" + text + "\n});";
        }
        result += "})(this." + defineProp + ");";
        if (options.auto) {
          if (options.auto[0] === '.') {
            autoModule = options.auto.replace(/^\./, packageName);
          } else {
            autoModule = "" + packageName + "/" + options.auto;
          }
          result += "(function(" + requireProp + ") {\n  " + requireProp + "('" + autoModule + "')\n})(this." + requireProp + ");";
        }
        that.mapAssets(task, options, result);
        return cb(null);
      };
      return Async.series([doLoader, doIncludes, doAliases, doBody], cb);
    };

    CommonJsify.prototype.mapAssets = function(task, options, script) {
      var asset, generator, json, mapAsset, mapFilename, source, sourceRoot, _i, _len, _ref;

      if (options.sourceMap) {
        sourceRoot = options.sourceRoot;
        script += "/*\n//@ sourceMappingURL=" + (changeExtname(Path.basename(options.filename), ".map")) + "\n*/";
        generator = SourceMap.createGenerator(options.filename);
        _ref = task.assets.array();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          asset = _ref[_i];
          if (asset.sourceMapOffset != null) {
            mapFilename = changeExtname(asset.filename, ".map");
            mapAsset = task.assets.detect(function(map) {
              return map.filename === mapFilename;
            });
            if (mapAsset) {
              json = mapAsset.text;
              mapAsset.markDelete = true;
              source = Utils.lchomp(asset.originalFilename, options.root);
              source = Utils.lchomp(source, "/");
              SourceMap.rebase(generator, json, source, asset.sourceMapOffset);
            }
          }
        }
        mapAsset = task.assets.create({
          filename: changeExtname(options.filename, ".map"),
          text: '',
          __map: generator.toJSON()
        });
        mapAsset.whenWriting(function() {
          if (!sourceRoot) {
            sourceRoot = Utils.unixPath(Path.relative(mapAsset.dirname, options.root));
          }
          mapAsset.__map.sourceRoot = sourceRoot;
          mapAsset.__map.file = changeExtname(mapAsset.basename, ".js");
          mapAsset.text = JSON.stringify(mapAsset.__map);
          return delete mapAsset.__map;
        });
      }
      task.assets.removeAssets(function(asset) {
        return asset.markDelete;
      });
      return asset = task.assets.create({
        filename: options.filename,
        text: script
      });
    };

    return CommonJsify;

  })(TaskProcessor);
};
