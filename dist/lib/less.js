// Generated by CoffeeScript 1.6.3
(function() {
  var path, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("lodash");

  path = require("path");

  module.exports = function(Projmate) {
    var Less, Parser, schema, _ref;
    Parser = require("less").Parser;
    schema = {
      title: 'Compiles Less CSS',
      type: 'object',
      __: {
        extnames: ".less",
        outExtname: ".css",
        defaults: {
          development: {
            dumpLineNumbers: "comments",
            compress: false
          },
          production: {
            compress: true
          }
        }
      }
    };
    return Less = (function(_super) {
      __extends(Less, _super);

      function Less() {
        _ref = Less.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Less.schema = schema;

      Less.prototype.process = function(asset, options, cb) {
        var ex, parser;
        options.filename = asset.filename;
        options.paths = [asset.dirname];
        try {
          parser = new Parser(options);
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

}).call(this);
