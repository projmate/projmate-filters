/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path, coffee, prettyErrorMessage, repeat, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

coffee = require("coffee-script");

_ = require("lodash");

Path = require("path");

exports.repeat = repeat = function(str, n) {
  var res;
  res = '';
  while (n > 0) {
    if (n & 1) {
      res += str;
    }
    n >>>= 1;
    str += str;
  }
  return res;
};

prettyErrorMessage = function(error, fileName, code) {
  var codeLine, end, first_column, first_line, last_column, last_line, marker, message, start, _ref;
  if (!error.location) {
    return error.stack || ("" + error);
  }
  _ref = error.location, first_line = _ref.first_line, first_column = _ref.first_column, last_line = _ref.last_line, last_column = _ref.last_column;
  codeLine = code.split('\n')[first_line];
  start = first_column;
  end = first_line === last_line ? last_column + 1 : codeLine.length;
  marker = repeat(' ', start) + repeat('^', end - start);
  return message = "\n\n" + fileName + ":" + (first_line + 1) + ":" + (first_column + 1) + ": error: " + error.message + "\n" + codeLine + "\n" + marker;
};

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
        sourceMap: false
      },
      production: {
        sourceMap: false
      }
    };

    Coffee.prototype.process = function(asset, options, cb) {
      var err, js, mapAsset, result, sourceMap;
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
          js += "\n\n/*\n//@ sourceMappingURL=" + (Utils.changeExtname(asset.basename, '.map')) + "\n*/";
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
        err = _error;
        return cb(prettyErrorMessage(err, asset.filename, asset.text));
      }
    };

    return Coffee;

  })(Filter);
};
