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
  var PreProcessor, _ref;
  return PreProcessor = (function(_super) {

    __extends(PreProcessor, _super);

    function PreProcessor() {
      _ref = PreProcessor.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PreProcessor.prototype.extnames = "*";

    PreProcessor.prototype.process = function(asset, options, cb) {
      var ex, result;
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
