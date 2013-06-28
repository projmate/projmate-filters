/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path, delimiters, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Path = require('path');

_ = require('lodash');

delimiters = {
  ejs: {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%-([\s\S]+?)%>/g,
    escape: /<%=([\s\S]+?)%>/g
  },
  php: {
    evaluate: /<\?([\s\S]+?)\?>/g,
    interpolate: /<\?-([\s\S]+?)\?>/g,
    escape: /<\?=([\s\S]+?)\?>/g
  },
  mustache: {
    interpolate: /{{{(.+?)}}}/g,
    escape: /{{([^{]+?)}}/g
  }
};

module.exports = function(Projmate) {
  var Filter, Jst, Utils, _ref;
  Filter = Projmate.Filter, Utils = Projmate.Utils;
  return Jst = (function(_super) {
    __extends(Jst, _super);

    function Jst() {
      _ref = Jst.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Jst.prototype.extnames = ['.jst', '.html', '.ejs'];

    Jst.prototype.outExtname = ".html";

    Jst.meta = {
      description: "Compiles a buffer into a JavaScript function using the following\ndirectives:\n\nfunction(it, foo)   // must be first line\n\n<%= escaped %>\n<%- raw %>\n<% code %>",
      options: {
        paramName: {
          type: 'string',
          desc: 'The name of the single parameter to the function.',
          "default": 'it'
        }
      }
    };

    Jst.prototype.render = function(asset, options, cb) {
      var ex, func, newlinePos, result, templateDelimiters, text;
      if (options.delimiters && delimiters[options.delimiters]) {
        templateDelimiters = delimiters[options.delimiters];
      } else {
        templateDelimiters = delimiters.ejs;
      }
      text = asset.text;
      if (text.indexOf('<!--function') === 0) {
        newlinePos = text.indexOf('\n');
        func = text.slice(0, newlinePos);
        func = func.match(/function[^-]*/)[0];
        text = text.slice(newlinePos + 1);
      }
      if (func) {
        options.variable = 'SUPAHFLY';
      }
      try {
        _.extend(_.templateSettings, templateDelimiters);
        result = _.template(text, options);
        return cb(null, {
          text: result,
          extname: '.html'
        });
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    Jst.prototype.process = function(asset, options, cb) {
      var compiled, defaults, ex, fnName, func, newlinePos, text;
      if (options.jst) {
        options.variable = options.paramName || 'it';
        defaults = {
          evaluate: /<%([\s\S]+?)%>/g,
          interpolate: /<%-([\s\S]+?)%>/g,
          escape: /<%=([\s\S]+?)%>/g
        };
        _.defaults(options, defaults);
        text = asset.text;
        if (text.indexOf('<!--function') === 0) {
          newlinePos = text.indexOf('\n');
          func = text.slice(0, newlinePos);
          func = func.match(/function[^-]*/)[0];
          text = text.slice(newlinePos + 1);
        }
        if (func) {
          options.variable = 'SUPAHFLY';
        }
        try {
          compiled = _.template(text, null, options);
          text = compiled.source;
          if (func) {
            text = text.replace("function(SUPAHFLY)", func);
            text = text.replace(/SUPAHFLY\./g, '');
          }
          fnName = Path.basename(asset.basename, asset.extname);
          text = text.replace('function', "function " + fnName) + ("\nmodule.exports = " + fnName + ";");
          return cb(null, {
            text: text,
            extname: '.js'
          });
        } catch (_error) {
          ex = _error;
          return cb(ex);
        }
      } else {
        return this.render(asset, options, cb);
      }
    };

    return Jst;

  })(Projmate.Filter);
};
