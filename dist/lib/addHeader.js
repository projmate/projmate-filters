var Fs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Fs = require("fs");

module.exports = function(Projmate) {
  var AddHeader;
  return AddHeader = (function(_super) {
    __extends(AddHeader, _super);

    AddHeader.schema = {
      title: 'Prepends a header if it does not exist',
      type: 'object',
      properties: {
        text: {
          description: 'The text to prepend',
          type: 'string'
        },
        filename: {
          description: 'Path to file containing text',
          type: 'string'
        }
      },
      __: {
        extnames: "*"
      }
    };

    function AddHeader() {
      this.cache = {};
      AddHeader.__super__.constructor.apply(this, arguments);
    }

    AddHeader.prototype.process = function(asset, options, cb) {
      var cache, filename, header, returnResult, text;
      text = options.text, filename = options.filename;
      returnResult = function(header) {
        if (asset.text.indexOf(header) < 0) {
          return cb(null, header + asset.text);
        } else {
          return cb();
        }
      };
      if (text) {
        return returnResult(text);
      } else if (filename) {
        cache = this.cache;
        header = cache[filename];
        if (header) {
          return returnResult(header);
        } else {
          return Fs.readFile(filename, 'utf8', function(err, header) {
            if (err) {
              return cb(err);
            }
            cache[filename] = header;
            return returnResult(header);
          });
        }
      } else {
        this.log.warn("Nothing to add, `options.text` or `options.filename` was empty");
        return cb();
      }
    };

    return AddHeader;

  })(Projmate.Filter);
};


/*
//@ sourceMappingURL=addHeader.map
*/