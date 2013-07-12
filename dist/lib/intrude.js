/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = function(Projmate) {
  var Once, schema, _ref;
  schema = {
    title: 'Run a custom command',
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
          title: 'Remove a temporary file generated by this task',
          text: "f.intrude(function() {\n  $.rm('-f', 'unwanted-file');\n})"
        }
      ]
    }
  };
  return Once = (function(_super) {
    __extends(Once, _super);

    function Once() {
      _ref = Once.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Once.schema = schema;

    Once.prototype.process = function(task, options, cb) {
      var ex, fn;
      fn = options.command;
      if (typeof fn !== "function") {
        return cb("Options.command is required and must be a function(asset, options[, cb])");
      }
      try {
        if (fn.length === 3) {
          return fn(task, options, cb);
        } else {
          fn(task, options);
          return cb();
        }
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Once;

  })(Projmate.Filter);
};