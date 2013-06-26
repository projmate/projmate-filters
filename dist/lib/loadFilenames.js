/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Async, Fs, Util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Async = require("async");

Fs = require("fs");

Util = require("util");

module.exports = function(Projmate) {
  var FileAsset, LoadFilenames, PmUtils, TaskProcessor, _ref;
  FileAsset = Projmate.FileAsset, TaskProcessor = Projmate.TaskProcessor, PmUtils = Projmate.Utils;
  return LoadFilenames = (function(_super) {
    __extends(LoadFilenames, _super);

    function LoadFilenames() {
      _ref = LoadFilenames.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LoadFilenames.prototype.extnames = "*";

    LoadFilenames.prototype.process = function(task, options, cb) {
      var assets, cwd, excludePatterns, log, patterns;
      log = this.log;
      cwd = process.cwd();
      patterns = task.config.files.include;
      excludePatterns = task.config.files.exclude;
      assets = task.assets;
      return PmUtils.glob(patterns, excludePatterns, {
        nosort: true
      }, function(err, files) {
        var file, stat, _i, _len;
        if (err) {
          return cb(err);
        }
        if (files.length > 0) {
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            stat = Fs.statSync(file);
            assets.create({
              filename: file,
              text: "",
              stat: stat,
              cwd: cwd
            });
          }
          return cb();
        } else {
          return cb("No files found: " + Util.inspect(patterns));
        }
      });
    };

    return LoadFilenames;

  })(TaskProcessor);
};
