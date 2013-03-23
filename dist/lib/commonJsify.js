/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path, async, fs, numberOfLines, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("lodash");

async = require('async');

fs = require('fs');

Path = require("path");

numberOfLines = function(s) {
  var matches;

  matches = s.match(/(\r|\n)/g);
  return matches.length + 1;
};

module.exports = function(Projmate) {
  var CommonJsify, SourceMap, TaskProcessor, Utils;

  TaskProcessor = Projmate.TaskProcessor, Utils = Projmate.Utils;
  SourceMap = require("../support/sourceMap");
  return CommonJsify = (function(_super) {
    __extends(CommonJsify, _super);

    CommonJsify.prototype.extnames = ".js";

    function CommonJsify() {
      this.extnames = ".js";
      this.defaults = {
        development: {
          sourceMap: true
        },
        production: {
          sourceMap: false
        }
      };
      CommonJsify.__super__.constructor.apply(this, arguments);
    }

    CommonJsify.prototype.process = function(task, options, cb) {
      var asset, assets, baseDir, basename, dirname, extname, identifier, index, packageName, path, result, sourceMap, text, _i, _len;

      identifier = options.identifier || "require";
      assets = task.assets.array();
      packageName = options.packageName || "app";
      baseDir = Utils.unixPath(options.baseDir);
      sourceMap = options.sourceMap;
      if (!baseDir) {
        return cb("`options.baseDir` is required.");
      }
      result = "(function() {\n  if (!this." + identifier + ") {\n    var modules = {}, packages = {}, cache = {},\n\n    require = function(name, root) {\n      var path = expand(root, name), module = cache[path], fn;\n      if (module) {\n        return module;\n      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {\n        module = {id: name, exports: {}};\n        try {\n          cache[path] = module.exports;\n\n          //=> fn(exports, require, module, __filename, __dirname)\n          fn(module.exports, function(name) {\n            return require(name, dirname(path));\n          }, module, path, dirname(path));\n\n          return cache[path] = module.exports;\n        } catch (err) {\n          delete cache[path];\n          throw err;\n        }\n      } else {\n        throw 'module \\'' + name + '\\' not found';\n      }\n    },\n\n    expand = function(root, name) {\n      var results = [], parts, part;\n      if (/^\\.\\.?(\\/|$)/.test(name)) {\n        parts = [root, name].join('/').split('/');\n      } else {\n        parts = name.split('/');\n      }\n      for (var i = 0, length = parts.length; i < length; i++) {\n        part = parts[i];\n        if (part == '..') {\n          results.pop();\n        } else if (part != '.' && part != '') {\n          results.push(part);\n        }\n      }\n      return results.join('/');\n    },\n\n    dirname = function(path) {\n      return path.split('/').slice(0, -1).join('/');\n    };\n\n    this." + identifier + " = function(name) {\n      return require(name, '');\n    }\n    this." + identifier + ".define = function(bundle, package) {\n      if (!package) {\n        package = \"stitch\";\n      }\n      if (packages[package]) {\n        throw \"Stitch - Package already defined '\"+package+\"'\";\n      }\n\n      for (var key in bundle)\n        modules[package+\"/\"+key] = bundle[key];\n    };\n  }\n  return this." + identifier + ".define;\n}).call(this)({";
      index = 0;
      for (_i = 0, _len = assets.length; _i < _len; _i++) {
        asset = assets[_i];
        dirname = asset.dirname, basename = asset.basename, extname = asset.extname, text = asset.text;
        if (extname === ".map") {
          continue;
        }
        path = Utils.unixPath(Path.join(dirname, Path.basename(basename, extname)));
        if (options.baseDir) {
          baseDir = Utils.rensure(options.baseDir, '/');
          path = Utils.lchomp(path, baseDir);
        }
        result += index++ === 0 ? "" : ", ";
        result += JSON.stringify(path);
        result += ": function(exports, require, module, __filename, __dirname) {\n";
        asset.sourceMapOffset = numberOfLines(result) - 1;
        text = text.replace(/^\/\/@ sourceMappingURL.*$/gm, "");
        asset.markDelete = true;
        result += "" + text + "\n}";
      }
      result += "}, '" + packageName + "');\n";
      this.mapAssets(task, options, result);
      return cb(null);
    };

    CommonJsify.prototype.mapAssets = function(task, options, script) {
      var asset, generator, json, mapAsset, mapFilename, unmappedGenerator, _i, _len, _ref;

      if (options.sourceMap) {
        script += "/*\n//@ sourceMappingURL=" + (Utils.changeExtname(Path.basename(options.filename), ".map")) + "\n*/";
        generator = SourceMap.createGenerator(options.filename);
        _ref = task.assets.array();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          asset = _ref[_i];
          if (asset.sourceMapOffset != null) {
            mapFilename = Utils.changeExtname(asset.filename, ".map");
            mapAsset = task.assets.detect(function(map) {
              return map.filename === mapFilename;
            });
            if (mapAsset) {
              json = mapAsset.text;
              mapAsset.markDelete = true;
            } else {
              unmappedGenerator = SourceMap.createGenerator(asset.filename);
              unmappedGenerator.setSourceContent(asset.basename, asset.text);
              json = unmappedGenerator.toJSON();
            }
            SourceMap.rebase(generator, json, asset.sourceMapOffset);
          }
        }
        mapAsset = task.assets.create({
          filename: Utils.changeExtname(options.filename, ".map"),
          text: generator.toJSON()
        });
        mapAsset.whenWriting(function() {
          mapAsset.text.file = Utils.changeExtname(mapAsset.basename, ".js");
          return mapAsset.text = JSON.stringify(mapAsset.text);
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
