var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = function(Projmate) {
  var Cat, TaskProcessor, schema, _ref;
  TaskProcessor = Projmate.TaskProcessor;
  schema = {
    title: 'Concatenates files',
    __: {
      extnames: "*"
    }
  };
  return Cat = (function(_super) {
    __extends(Cat, _super);

    function Cat() {
      _ref = Cat.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Cat.schema = schema;

    Cat.prototype.process = function(task, options, cb) {
      var filename, first, join, script;
      if (task.assets.isEmpty()) {
        return cb();
      }
      join = options.join || "";
      filename = options.filename;
      script = "";
      first = true;
      task.assets.each(function(asset) {
        if (join.length > 0 && !first) {
          script += join;
        }
        script += asset.text;
        first = false;
        return true;
      });
      task.assets.clear();
      return cb(null, task.assets.create({
        filename: filename,
        text: script
      }));
    };

    return Cat;

  })(TaskProcessor);
};


/*
//@ sourceMappingURL=cat.map
*/