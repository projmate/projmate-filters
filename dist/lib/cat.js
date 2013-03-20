/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = function(Projmate) {
  var Cat, TaskProcessor, _ref;

  TaskProcessor = Projmate.TaskProcessor;
  return Cat = (function(_super) {
    __extends(Cat, _super);

    function Cat() {
      _ref = Cat.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Cat.prototype.extnames = "*";

    Cat.prototype.process = function(task, options, cb) {
      var asset, cwd, filename, first, join, script, _i, _len, _ref1;

      if (task.assets.length < 1) {
        return cb();
      }
      join = options.join || "";
      filename = options.filename;
      script = "";
      first = true;
      _ref1 = task.assets;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        asset = _ref1[_i];
        if (join.length > 0 && !first) {
          script += join;
        }
        script += asset.text;
        first = false;
      }
      cwd = task.assets[0].cwd;
      task.assets.clear();
      task.assets.create({
        filename: filename,
        text: script
      });
      return cb();
    };

    return Cat;

  })(TaskProcessor);
};
