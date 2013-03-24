/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path, coffee, defer, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

coffee = require("coffee-script");

_ = require("lodash");

defer = require("when").defer;

Path = require("path");

module.exports = function(Projmate) {
  var Coffee, Filter, Utils, _ref;

  Filter = Projmate.Filter, Utils = Projmate.Utils;
  return Coffee = (function(_super) {
    __extends(Coffee, _super);

    function Coffee() {
      _ref = Coffee.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Coffee.prototype.extnames = [".coffee", ".litcoffee", ".coffee.md"];

    Coffee.prototype.outExtname = ".js";

    Coffee.prototype.defaults = {
      development: {
        sourceMap: true
      },
      production: {
        sourceMap: false
      }
    };

    Coffee.prototype.process = function(asset, options, cb) {
      var ex, js, mapAsset, result, sourceMap;

      if (options.sourceMap) {
        options.filename = asset.filename;
        options.sourceFiles = [asset.basename];
        options.generatedFile = Utils.changeExtname(asset.basename, ".js");
      }
      try {
        result = coffee.compile(asset.text, options);
        if (result.v3SourceMap) {
          js = result.js;
          sourceMap = result.v3SourceMap;
          js += "\n\n/*\n//@ sourceMappingURL=" + (Utils.changeExtname(asset.filename, '.map')) + "\n*/";
          mapAsset = asset.parent.create({
            filename: Utils.changeExtname(asset.filename, ".map"),
            text: sourceMap
          });
          mapAsset.whenWriting(function() {
            var relPath;

            relPath = Path.relative(Path.dirname(asset.filename), asset.originalFilename);
            return mapAsset.text = mapAsset.text.replace(Path.basename(asset.originalFilename), relPath);
          });
        } else {
          js = result;
        }
        return cb(null, js);
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Coffee;

  })(Filter);
};
/*
//@ sourceMappingURL=src/lib/coffee.map
*/