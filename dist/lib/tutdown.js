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
      this.extnames = [".md", ".js", ".coffee"];
      this.outExtname = ".html";
      Markdown.__super__.constructor.apply(this, arguments);
    }

    Markdown.prototype.defaults = {
      dev: {
        navHeaderTemplate: "<a href='index.html'>\n  <div class='nav-title'>API Docs</div>\n</a>",
        contentHeaderTemplate: "<a href='index.html'>\n  <img id='logo' src='img/logo.png'/>\n</a>",
        contentFooterTemplate: "<script>\n  (function() {\n    var b = document.createElement(\"script\"); b.type = \"text/javascript\"; b.async = true;\n    b.src = \"//barc.com/js/libs/barc/barc.js\";\n    var s = document.getElementsByTagName(\"script\")[0]; s.parentNode.insertBefore(b, s);\n  })();\n</script>"
      }
    };

    Markdown.prototype.process = function(asset, options, cb) {
      options.assetsDirname = asset.dirname + '/_assets';
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
