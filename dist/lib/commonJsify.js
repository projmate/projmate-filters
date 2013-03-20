/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path, async, fs, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("lodash");

async = require('async');

fs = require('fs');

Path = require("path");

module.exports = function(Projmate) {
  var CommonJsify, TaskProcessor, Utils;

  TaskProcessor = Projmate.TaskProcessor, Utils = Projmate.Utils;
  return CommonJsify = (function(_super) {
    __extends(CommonJsify, _super);

    CommonJsify.prototype.extnames = "*";

    function CommonJsify() {
      CommonJsify.__super__.constructor.apply(this, arguments);
    }

    CommonJsify.prototype.process = function(task, options, cb) {
      var assets, baseDir, basename, dirname, extname, identifier, index, packageName, path, result, text, _i, _len, _ref;

      identifier = options.identifier || "require";
      assets = task.assets;
      packageName = options.packageName || "app";
      baseDir = Utils.unixPath(options.baseDir);
      if (!baseDir) {
        return cb("`options.baseDir` is required.");
      }
      result = "(function() {\n  if (!this." + identifier + ") {\n    var modules = {}, packages = {}, cache = {},\n\n    require = function(name, root) {\n      var path = expand(root, name), module = cache[path], fn;\n      if (module) {\n        return module;\n      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {\n        module = {id: name, exports: {}};\n        try {\n          cache[path] = module.exports;\n\n          //=> fn(exports, require, module, __filename, __dirname)\n          fn(module.exports, function(name) {\n            return require(name, dirname(path));\n          }, module, path, dirname(path));\n\n          return cache[path] = module.exports;\n        } catch (err) {\n          delete cache[path];\n          throw err;\n        }\n      } else {\n        throw 'module \\'' + name + '\\' not found';\n      }\n    },\n\n    expand = function(root, name) {\n      var results = [], parts, part;\n      if (/^\\.\\.?(\\/|$)/.test(name)) {\n        parts = [root, name].join('/').split('/');\n      } else {\n        parts = name.split('/');\n      }\n      for (var i = 0, length = parts.length; i < length; i++) {\n        part = parts[i];\n        if (part == '..') {\n          results.pop();\n        } else if (part != '.' && part != '') {\n          results.push(part);\n        }\n      }\n      return results.join('/');\n    },\n\n    dirname = function(path) {\n      return path.split('/').slice(0, -1).join('/');\n    };\n\n    this." + identifier + " = function(name) {\n      return require(name, '');\n    }\n    this." + identifier + ".define = function(bundle, package) {\n      if (!package) {\n        package = \"stitch\";\n      }\n      if (packages[package]) {\n        throw \"Stitch - Package already defined '\"+package+\"'\";\n      }\n\n      for (var key in bundle)\n        modules[package+\"/\"+key] = bundle[key];\n    };\n  }\n  return this." + identifier + ".define;\n}).call(this)({";
      index = 0;
      for (_i = 0, _len = assets.length; _i < _len; _i++) {
        _ref = assets[_i], dirname = _ref.dirname, basename = _ref.basename, extname = _ref.extname, text = _ref.text;
        path = Utils.unixPath(Path.join(dirname, Path.basename(basename, extname)));
        if (options.baseDir) {
          baseDir = Utils.rensure(options.baseDir, '/');
          path = Utils.lchomp(path, baseDir);
        }
        result += index++ === 0 ? "" : ", ";
        result += JSON.stringify(path);
        result += ": function(exports, require, module, __filename, __dirname) {" + text + "}";
      }
      result += "}, '" + packageName + "');\n";
      this.reduceAssets(task, options, result);
      return cb(null);
    };

    CommonJsify.prototype.reduceAssets = function(task, options, script) {
      task.assets.clear();
      return task.assets.create({
        filename: options.filename,
        text: script
      });
    };

    return CommonJsify;

  })(TaskProcessor);
};
