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
  title: 'Filters asset(s) through a template.',
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

    Template.prototype.process = function(asset, options, cb) {
      var ex, result, templateDelimiters, text;
      if (!(options.text || options.filename)) {
        return cb('options.text or options.filename is required');
      }
      options.asset = asset;
      if (options.delimiters && delimiters[options.delimiters]) {
        templateDelimiters = delimiters[options.delimiters];
      } else {
        templateDelimiters = delimiters.ejs;
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
        text = options.text;
      }
      try {
        _.extend(_.templateSettings, templateDelimiters);
        result = _.template(text, options);
        return cb(null, result);
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Template;

  })(Projmate.Filter);
};


/*
//@ sourceMappingURL=template.map
*/