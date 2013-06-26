/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Path = require('path');

_ = require('lodash');

module.exports = function(Projmate) {
  var Filter, JadeFilter, Utils, jade, _ref;
  Filter = Projmate.Filter, Utils = Projmate.Utils;
  jade = require('jade');
  return JadeFilter = (function(_super) {
    __extends(JadeFilter, _super);

    function JadeFilter() {
      _ref = JadeFilter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    JadeFilter.prototype.extnames = '.jade';

    JadeFilter.prototype.process = function(asset, options, cb) {
      var defaults, ex, fn, result, text;
      if (options.jst) {
        defaults = {
          client: true,
          compileDebug: true,
          pretty: true
        };
        _.defaults(options, defaults);
        try {
          text = asset.text;
          fn = jade.compile(text, options);
          result = "module.exports = " + (fn.toString().replace(/^function anonymous/, 'function'));
          return cb(null, {
            text: result,
            extname: '.js'
          });
        } catch (_error) {
          ex = _error;
          return cb(ex);
        }
      } else {
        defaults = {
          client: false,
          compileDebug: true,
          filename: asset.filename,
          pretty: true
        };
        _.defaults(options, defaults);
        try {
          text = asset.text;
          fn = jade.compile(text, options);
          return cb(null, {
            text: fn(options),
            extname: '.html'
          });
        } catch (_error) {
          ex = _error;
          return cb(ex);
        }
      }
    };

    return JadeFilter;

  })(Filter);
};
