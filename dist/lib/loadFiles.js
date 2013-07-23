var Async, Fs, Util, schema, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Async = require("async");

Fs = require("fs");

Util = require("util");

_ = require("lodash");

schema = {
  title: 'Loads file using task patterns and creates FileAsset(s)',
  type: 'object',
  __: {
    extnames: "*",
    isAssetLoader: true
  }
};

module.exports = function(Projmate) {
  var FileAsset, LoadFiles, PmUtils, TaskProcessor, _ref;
  FileAsset = Projmate.FileAsset, TaskProcessor = Projmate.TaskProcessor, PmUtils = Projmate.Utils;
  return LoadFiles = (function(_super) {
    __extends(LoadFiles, _super);

    function LoadFiles() {
      _ref = LoadFiles.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LoadFiles.schema = schema;

    LoadFiles.prototype.process = function(task, options, cb) {
      var assets, cwd, excludePatterns, files, log, patterns;
      log = this.log;
      cwd = process.cwd();
      if (options._args) {
        options.include = options._args;
      }
      if (options.include) {
        files = {
          include: options.include,
          exclude: options.exclude
        };
        PmUtils.normalizeFiles({
          files: files
        }, 'files');
      } else {
        files = task.config.files;
      }
      patterns = files.include;
      excludePatterns = files.exclude;
      assets = task.assets;
      return PmUtils.glob(patterns, excludePatterns, {
        nosort: true
      }, function(err, files) {
        if (err) {
          log.error("patterns: " + patterns + " " + excludePatterns);
          return cb(err);
        }
        if (!files || files.length === 0) {
          return cb("No files match: " + patterns + " " + excludePatterns);
        }
        if (files.length > 0) {
          return Async.eachSeries(files, function(file, cb) {
            if (file.indexOf("./") === 0 || file.indexOf(".\\") === 0) {
              file = file.slice(2);
            }
            return Fs.stat(file, function(err, stat) {
              if (err) {
                return cb(err);
              }
              if (stat.isDirectory()) {
                return cb();
              }
              if (PmUtils.isFileBinary(file)) {
                log.debug("Ignoring binary file: " + file);
                return cb();
              }
              return Fs.readFile(file, "utf8", function(err, text) {
                if (err) {
                  return cb(err);
                }
                assets.create({
                  filename: file,
                  text: text,
                  stat: stat,
                  cwd: cwd
                });
                return cb();
              });
            });
          }, cb);
        } else {
          return cb("No files found: " + Util.inspect(patterns));
        }
      });
    };

    return LoadFiles;

  })(TaskProcessor);
};


/*
//@ sourceMappingURL=loadFiles.map
*/