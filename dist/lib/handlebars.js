/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Path = require("path");

module.exports = function(Projmate) {
  var Handlebars;
  return Handlebars = (function(_super) {
    __extends(Handlebars, _super);

    function Handlebars() {
      this.extnames = ".hbs";
      this.outExtname = ".html";
      Handlebars.__super__.constructor.apply(this, arguments);
    }

    Handlebars.prototype.process = function(asset, options, cb) {
      var config, hbs, _;
      if (!options.root) {
        return cb("options.root is required");
      }
      _ = require("lodash");
      hbs = require("../support/express-hbs/hbs");
      _.defaults(options, {
        extname: ".hbs"
      });
      if (!this.render) {
        config = _.clone(options);
        config.cache = false;
        this.render = hbs.init(config);
      }
      return this.render(asset.filename, asset.text, options, cb);
    };

    return Handlebars;

  })(Projmate.Filter);
};
