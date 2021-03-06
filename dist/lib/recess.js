/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var recess,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

recess = require("recess");

module.exports = function(Projmate) {
  var Coffee, _ref;
  return Coffee = (function(_super) {

    __extends(Coffee, _super);

    function Coffee() {
      _ref = Coffee.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Coffee.prototype.extnames = [".css", ".less"];

    Coffee.prototype.outExtname = ".css";

    Coffee.prototype.process = function(asset, options, cb) {
      var ex;
      try {
        return recess(asset.filename, options, function(err, result) {
          if (err) {
            return cb(err);
          }
          return cb(null, result.output);
        });
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Coffee;

  })(Projmate.Filter);
};
