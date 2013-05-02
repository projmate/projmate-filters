/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path, UglifyJS, moduleSignature, numberOfLines,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Path = require("path");

UglifyJS = require("uglify-js");

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

    CommonJsify.prototype.requireShim = function(options, requireProp, defineProp) {
      var diagnostics, result, signature;

      if (options.DEVELOPMENT) {
        diagnostics = "_require.modules = function() { return modules; };\n_require.cache = function() { return cache; };";
      } else {
        diagnostics = "";
      }
      signature = moduleSignature(options.simplifiedCjs);
      return result = "(function(root) {\n  if (!root." + requireProp + ") {\n    var modules = {}, cache = {};\n\n    function dirname(path) {\n      return path.split('/').slice(0, -1).join('/');\n    }\n\n    function expand(root, name) {\n      var results = [], parts, part;\n      if (/^\\.\\.?(\\/|$)/.test(name)) {\n        parts = [root, name].join('/').split('/');\n      } else {\n        parts = name.split('/');\n      }\n      for (var i = 0, length = parts.length; i < length; i++) {\n        part = parts[i];\n        if (part === '..') {\n          results.pop();\n        } else if (part !== '.' && part !== '') {\n          results.push(part);\n        }\n      }\n      return results.join('/');\n    }\n\n    function require(name, root) {\n      var path = expand(root, name), module = cache[path], fn;\n      if (module) return module;\n\n      if (fn = modules[path] || modules[path = expand(path, './index')]) {\n        module = {id: path, exports: {}};\n        try {\n          cache[path] = module.exports;\n          function req(name) {\n            return require(name, dirname(path));\n          }\n          fn(" + signature + ");\n          return cache[path] = module.exports;\n        } catch (err) {\n          delete cache[path];\n          throw err;\n        }\n      } else {\n        throw 'module \\'' + name + '\\' not found';\n      }\n    }\n\n    function _require(name) {\n      return require(name, '');\n    };\n    _require.resolve = function(path) {\n      return expand('', name);\n    };\n\n    " + diagnostics + "\n\n    function _define(path, deps, mod) {\n      if (arguments.length === 2) {\n        mod = deps;\n        deps = [];\n      };\n      modules[path] = mod;\n    };\n  }\n\n  root." + requireProp + " = _require;\n  root." + defineProp + " = _define;\n})(this);";
    };

    CommonJsify.prototype.process = function(task, options, cb) {
      var asset, assets, autoModule, basename, defineProp, dirname, err, extname, loader, originalFilename, packageName, packagePath, path, requireProp, result, root, signature, simplifiedCjs, sourceMap, text, ugly, _i, _len, _ref;

      loader = options.loader != null ? options.loader : true;
      requireProp = options.requireProp || options.identifier || "require";
      defineProp = options.defineProp || "define";
      simplifiedCjs = options.simplifiedCjs != null ? options.simplifiedCjs : false;
      assets = task.assets.array();
      packageName = options.packageName || options.name || "app";
      options.root = Utils.unixPath(options.root || options.baseDir);
      sourceMap = options.sourceMap;
      options.auto = options.auto || options.autoRequire;
      if (!options.root) {
        return cb("`options.root` is required.");
      }
      if ((_ref = options.filename) == null) {
        options.filename = Path.dirname(options.root) + '/' + options.name + '.js';
      }
      result = ";";
      if (loader) {
        result += this.requireShim(options, requireProp, defineProp);
      }
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
        signature = moduleSignature(simplifiedCjs);
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
            this.log.error("" + asset.filename);
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
      this.mapAssets(task, options, result);
      return cb(null);
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
