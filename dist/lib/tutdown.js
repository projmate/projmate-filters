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
  var Markdown, schema, tutdown, _ref;
  tutdown = require("tutdown");
  schema = {
    title: 'Creates awesome docuementation from Coffee, JS, and Markdown',
    type: 'object',
    properties: {
      assetsDirname: {
        type: 'string',
        description: 'Directory to write assets'
      }
    },
    __: {
      extnames: ['.md', '.js', '.coffee'],
      outExtname: '.html'
    }
  };
  return Markdown = (function(_super) {
    __extends(Markdown, _super);

    function Markdown() {
      _ref = Markdown.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Markdown.schema = schema;

    Markdown.prototype.process = function(asset, options, cb) {
      options.assetsDirname = asset.dirname + '/_assets';
      options.assetPrefix = Path.basename(asset.basename, asset.extname);
      if (options.layout) {
        options.docLayoutFile = options.layout;
      }
      if (asset.extname === ".md") {
        return tutdown.render(asset.text, options, cb);
      } else {
        if (asset.extname === ".coffee") {
          options.coffeeScript = true;
        }
        return tutdown.renderApi(asset.text, options, function(err, result) {
          var content, nav;
          if (err) {
            return cb(err);
          }
          content = result.content, nav = result.nav;
          asset.nav = nav;
          return cb(null, {
            text: content,
            extname: ".html"
          });
        });
      }
    };

    return Markdown;

  })(Projmate.Filter);
};
