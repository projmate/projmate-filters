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
        description: 'Paths to include'
      },
      compress: {
        type: 'boolean',
        description: 'Whether to compress the output CSS'
      },
      defines: {
        type: 'array',
        description: 'Key-value pairs to define',
        items: 'object'
      },
      nib: {
        type: 'boolean',
        description: 'Enables nib support'
      },
      imports: {
        type: 'array',
        description: 'Assets to import',
        items: 'string'
      },
      plugins: {
        type: 'array',
        description: 'Plugins to use',
        items: 'string'
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
      var k, nib, plugin, renderer, v, _ref1;
      if (options.paths == null) {
        options.paths = [asset.dirname];
      }
      renderer = stylus(asset.text, {
        filename: asset.filename
      });
      if (options.defines != null) {
        _ref1 = options.defines;
        for (k in _ref1) {
          v = _ref1[k];
          renderer.define(k, v);
        }
      }
      if (options.paths != null) {
        for (path in options.paths) {
          renderer.include(path);
        }
      }
      if (options.imports != null) {
        for (path in options.imports) {
          renderer["import"](path);
        }
      }
      if (options.plugins != null) {
        for (plugin in options.plugins) {
          renderer.use(Plugin);
        }
      }
      if (options.nib) {
        nib = require('nib');
        renderer.use(nib());
      }
      return renderer.render(cb);
    };

    return Stylus;

  })(Projmate.Filter);
};
