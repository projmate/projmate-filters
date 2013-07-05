/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var path, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("lodash");

path = require("path");

module.exports = function(Projmate) {
  var Stylus, schema, stylus, _ref;
  stylus = require('stylus');
  schema = {
    title: 'Compiles Stylus CSS',
    type: 'object',
    properties: {
      linenos: {
        type: 'boolean',
        description: 'Reference source line numbers in compiled CSS'
      },
      paths: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Paths containing assets?'
      },
      compress: {
        type: 'boolean',
        description: 'Whether to compress the output CSS'
      }
    },
    __: {
      extnames: ".styl",
      outExtname: ".css",
      defaults: {
        development: {
          linenos: true,
          compress: false
        },
        production: {
          linenos: false,
          compress: true
        }
      }
    }
  };
  return Stylus = (function(_super) {
    __extends(Stylus, _super);

    function Stylus() {
      _ref = Stylus.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Stylus.schema = schema;

    Stylus.prototype.process = function(asset, options, cb) {
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

    return Stylus;

  })(Projmate.Filter);
};
