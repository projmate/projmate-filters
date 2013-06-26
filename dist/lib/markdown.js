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
  var Markdown, marked;
  marked = require("marked");
  return Markdown = (function(_super) {
    __extends(Markdown, _super);

    function Markdown() {
      this.extnames = ".md";
      this.outExtname = ".html";
      this.defaults = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        langPrefix: 'language-'
      };
      Markdown.__super__.constructor.apply(this, arguments);
    }

    Markdown.prototype.process = function(asset, options, cb) {
      var err, html, layout;
      try {
        html = marked(asset.text);
        if (options.layout) {
          if (this.layouts == null) {
            this.layouts = {};
          }
          layout = this.layouts[options.layout];
          if (!layout) {
            layout = Fs.readFileSync(options.layout, "utf8");
            this.layouts[options.layout] = layout;
          }
        }
        if (layout) {
          if (layout.indexOf('{{{body}}}') < 0) {
            return cb('Layout does not define {{{body}}} placeholder');
          }
          html = layout.replace('{{{body}}}', html);
        }
        return cb(null, html);
      } catch (_error) {
        err = _error;
        return cb(err);
      }
    };

    return Markdown;

  })(Projmate.Filter);
};
