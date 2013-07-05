/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var pp, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pp = require("../support/preprocess");

_ = require("lodash");

module.exports = function(Projmate) {
  var PreProcessor, escJs, schema, _ref;
  escJs = function(s) {
    return s.replace(/\\/g, '\\\\');
  };
  schema = {
    title: 'Preprocesses assets given definitions in options',
    type: 'object',
    __: {
      extnames: "*"
    }
  };
  return PreProcessor = (function(_super) {
    __extends(PreProcessor, _super);

    function PreProcessor() {
      _ref = PreProcessor.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PreProcessor.schema = schema;

    PreProcessor.prototype.process = function(asset, options, cb) {
      var ex, result, root;
      root = options.root || asset.dirname;
      _.defaults(options, {
        root: root,
        escJs: escJs
      });
      try {
        result = pp(asset.text, options);
        return cb(null, result.join("\n"));
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return PreProcessor;

  })(Projmate.Filter);
};
