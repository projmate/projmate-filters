/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var less, path, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

less = require("less");

_ = require("lodash");

path = require("path");

module.exports = function(Projmate) {
  var Less, _ref;
  return Less = (function(_super) {

    __extends(Less, _super);

    function Less() {
      _ref = Less.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Less.prototype.extnames = ".less";

    Less.prototype.outExtname = ".css";

    Less.prototype.process = function(asset, options, cb) {
      var ex, parser;
      options = _.defaults(options, {
        paths: [asset.dirname],
        compress: false
      });
      try {
        parser = new less.Parser(options);
        return parser.parse(asset.text, function(err, tree) {
          var css, ex;
          if (err) {
            return cb(err);
          }
          try {
            css = tree.toCSS(options);
            return cb(null, css);
          } catch (_error) {
            ex = _error;
            return cb(ex);
          }
        });
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Less;

  })(Projmate.Filter);
};
