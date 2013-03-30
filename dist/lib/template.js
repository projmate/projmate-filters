/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var cons,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cons = require("consolidate");

module.exports = function(Projmate) {
  var Template, _ref;

  return Template = (function(_super) {
    __extends(Template, _super);

    function Template() {
      _ref = Template.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Template.prototype.extnames = "*";

    Template.prototype.outExtname = ".html";

    Template.prototype.process = function(asset, options, cb) {
      var engine, ex;

      engine = options.engine || "underscore";
      if (options.requires) {
        require(options.requires);
      }
      if (!cons[engine].render) {
        return cb("Unknown template engine: " + options.engine);
      }
      try {
        return cons[engine].render(asset.text, options, cb);
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Template;

  })(Projmate.Filter);
};
