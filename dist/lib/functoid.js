/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

module.exports = function(Projmate) {
  var Functoid, _ref;
  return Functoid = (function(_super) {
    __extends(Functoid, _super);

    function Functoid() {
      _ref = Functoid.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Functoid.prototype.extnames = "*";

    Functoid.prototype.process = function(asset, options, cb) {
      var ex, fn, result;
      fn = options.command;
      if (typeof fn !== "function") {
        return cb("Options.command is required and must be a function(asset, options[, cb])");
      }
      try {
        if (fn.length === 3) {
          return fn(asset, options, cb);
        } else {
          result = fn(asset, options);
          return cb(null, result);
        }
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Functoid;

  })(Projmate.Filter);
};
