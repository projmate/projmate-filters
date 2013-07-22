var Async, Fs, Util, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Async = require("async");

Fs = require("fs");

Util = require("util");

_ = require('lodash');

module.exports = function(Projmate) {
  var FileAsset, PmUtils, TaskProcessor, Y, Yuidoc, _ref;
  FileAsset = Projmate.FileAsset, TaskProcessor = Projmate.TaskProcessor, PmUtils = Projmate.Utils;
  Y = require('yuidocjs');
  return Yuidoc = (function(_super) {
    __extends(Yuidoc, _super);

    function Yuidoc() {
      _ref = Yuidoc.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Yuidoc.schema = {
      title: 'Creates documentation from source.',
      type: 'object',
      __: {
        extnames: "*",
        useLoader: 'stat',
        defaults: {
          quiet: true
        },
        examples: [
          {
            title: 'Create documentation from dist folder',
            text: "dev: [\n  f.stat,\n  f.tap(function(asset) {\n    // log properties of asset, asset.text === ''\n    console.dir(asset);\n  })\n]"
          }
        ]
      }
    };

    Yuidoc.prototype.process = function(task, options, cb) {
      var assets, builder, dirnames, json;
      assets = task.assets;
      dirnames = assets.pluck('_dirname');
      if (!(dirnames != null ? dirnames.length : void 0) > 0) {
        return cb('directory not found');
      }
      options.paths = _.unique(dirnames);
      json = (new Y.YUIDoc(options)).run();
      options = Y.Project.mix(json, options);
      if (options.parseOnly) {
        return cb();
      } else {
        builder = new Y.DocBuilder(options, json);
        return builder.compile(cb);
      }
    };

    return Yuidoc;

  })(TaskProcessor);
};


/*
//@ sourceMappingURL=yuidoc.map
*/