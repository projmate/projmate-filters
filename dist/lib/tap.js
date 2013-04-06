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
  var Tap, _ref;

  return Tap = (function(_super) {
    __extends(Tap, _super);

    function Tap() {
      _ref = Tap.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Tap.prototype.extnames = "*";

    Tap.prototype.process = function(asset, options, cb) {
      var ex, fn;

      fn = options.command;
      if (typeof fn !== "function") {
        return cb("Options.command is required and must be a function(asset, options[, cb])");
      }
      try {
        if (fn.length === 3) {
          return fn(asset, options, cb);
        } else {
          fn(asset, options);
          return cb();
        }
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Tap;

  })(Projmate.Filter);
};
