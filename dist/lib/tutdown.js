/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Fs, Path,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Path = require("path");

Fs = require("fs");

module.exports = function(Projmate) {
  var Markdown, tutdown;
  tutdown = require("tutdown");
  return Markdown = (function(_super) {
    __extends(Markdown, _super);

    function Markdown() {
      this.extnames = ".md";
      this.outExtname = ".html";
      Markdown.__super__.constructor.apply(this, arguments);
    }

    Markdown.prototype.process = function(asset, options, cb) {
      var opts;
      opts = {
        assetsDirname: asset.dirname + '/_assets'
      };
      if (options.layout) {
        opts.docLayoutFile = options.layout;
      }
      return tutdown.render(asset.text, opts, cb);
    };

    return Markdown;

  })(Projmate.Filter);
};
