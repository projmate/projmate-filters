/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("lodash");

module.exports = function(Projmate) {
  var Uglify, UglifyJS, schema, _ref;
  UglifyJS = require("uglify-js");
  schema = {
    title: 'Minifies JavaScript',
    type: 'object',
    __: {
      extnames: ".js",
      outExtname: ".js"
    }
  };
  return Uglify = (function(_super) {
    __extends(Uglify, _super);

    function Uglify() {
      _ref = Uglify.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Uglify.schema = schema;

    Uglify.prototype.process = function(asset, options, cb) {
      var ex, result;
      options = _.defaults(options, {
        fromString: true
      });
      try {
        result = UglifyJS.minify(asset.text, options);
        return cb(null, result.code);
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Uglify;

  })(Projmate.Filter);
};
