var Fs, Path, delimiters, schema, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Path = require('path');

_ = require('lodash');

Fs = require('fs');

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

schema = {
  title: 'Converts files to JST',
  type: 'object',
  properties: {
    delimiters: {
      type: 'enum',
      description: 'The delimiters used in template. ejs | php | mustache'
    },
    filename: {
      type: 'string',
      description: 'Path to template file'
    },
    text: {
      type: 'string',
      description: 'String template'
    }
  },
  __: {
    extnames: ['*'],
    outExtname: ".html",
    examples: [
      {
        title: 'Use a mustache file',
        text: "f.template({delimiters: 'mustache', filename: 'src/docs/_layout.mustache'})"
      }, {
        title: 'Use a string template',
        text: "f.template({text: 'Your asset: <%= asset.text %>'})"
      }
    ]
  }
};

module.exports = function(Projmate) {
  var Filter, Template, Utils, _ref;
  Filter = Projmate.Filter, Utils = Projmate.Utils;
  return Template = (function(_super) {
    __extends(Template, _super);

    function Template() {
      _ref = Template.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Template.schema = schema;

    Template.prototype.render = function(asset, options, cb) {
      var ex, func, newlinePos, result, templateDelimiters, text;
      options.asset = asset;
      if (options.delimiters && delimiters[options.delimiters]) {
        templateDelimiters = delimiters[options.delimiters];
      } else {
        templateDelimiters = delimiters.ejs;
      }
      if (options.layout) {
        options.filename = options.layout;
      }
      if (options.filename) {
        if (this.cache == null) {
          this.cache = {};
        }
        if (this.cache[options.filename]) {
          text = this.cache[options.filename];
        } else {
          text = Fs.readFileSync(options.filename, 'utf8');
          this.cache[options.filename] = text;
        }
      } else {
        text = asset.text;
      }
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

    Template.prototype.process = function(asset, options, cb) {
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

    return Template;

  })(Projmate.Filter);
};


/*
//@ sourceMappingURL=jst.map
*/