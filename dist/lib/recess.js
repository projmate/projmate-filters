var recess,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

recess = require("recess");

module.exports = function(Projmate) {
  var Recess, _ref;
  return Recess = (function(_super) {
    __extends(Recess, _super);

    function Recess() {
      _ref = Recess.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Recess.schema = {
      title: 'Optimizes CSS',
      type: 'object',
      __: {
        extnames: [".css", ".less"],
        outExtname: ".css"
      }
    };

    Recess.prototype.process = function(asset, options, cb) {
      var ex;
      try {
        return recess(asset.filename, options, function(err, result) {
          if (err) {
            return cb(err);
          }
          return cb(null, result.output);
        });
      } catch (_error) {
        ex = _error;
        return cb(ex);
      }
    };

    return Recess;

  })(Projmate.Filter);
};


/*
//@ sourceMappingURL=recess.map
*/