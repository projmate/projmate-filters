var _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

module.exports = function(Projmate) {
  var Tap, schema, _ref;
  schema = {
    title: 'Custom processing',
    type: 'object',
    properties: {
      command: {
        description: '(assets, options) or (assets, options, cb)',
        type: 'function'
      }
    },
    __: {
      extnames: '*',
      examples: [
        {
          title: 'Change file name from `src` to `build`',
          text: "f.tap(function(asset) {\n  asset.filename = asset.filename.replace(/^src/, 'build');\n})"
        }, {
          title: 'Replace a string in assets',
          text: "f.tap(function(asset, options, cb) {\n  fs.readFile('common.txt', 'utf8', function(err, text) {\n    if (err) return cb(err);\n    asset.text = asset.text.replace('{{{common}}}', text);\n    cb();\n  });\n})"
        }, {
          title: 'Pass options, must use long form',
          text: "f.tap({ foo: 'bar', command: function(asset, options) {\n  // prints 'bar'\n  console.log(options.foo);\n}})"
        }
      ]
    }
  };
  return Tap = (function(_super) {
    __extends(Tap, _super);

    function Tap() {
      _ref = Tap.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Tap.schema = schema;

    Tap.prototype.process = function(asset, options, cb) {
      var ex, fn;
      fn = options.command;
      if (typeof fn !== "function") {
        return cb("Options.command is required and must be a function(asset, options[, cb])");
      }
      try {
        if (fn.length === 3) {
          return fn(asset, options, cb);
        } else {
          fn(asset, options);
          return cb();
        }
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Tap;

  })(Projmate.Filter);
};


/*
//@ sourceMappingURL=tap.map
*/