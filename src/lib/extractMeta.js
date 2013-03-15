/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var CSON = require('cson');


module.exports = function(Projmate) {

  /**
   * Extracts meta from a text file and assets it to `asset.meta`.
   *
   * @example
   * Meta must be assignalbe to CoffeeScript variable.
   * ---
   * foo: "FOO"
   * bar: "BAR"
   *   baz: ["bah", "asdf"]
   * ---
   */
  function ExtractMeta() {
    this.extnames = "*";
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(ExtractMeta);


  /**
   * Extracts meta.
   *
   * @param {Object} options = {
   *  {String} as: "merge" | "property"
   * }
   *
   * If options.as is "merge" then meta is merged into each
   * filter's options argument. This is the default.
   *
   * If options.as is "property" then asset._meta = meta.
   */
  ExtractMeta.prototype.process = function(asset, options, cb) {
    var re = /^---[\r\n]((.|[\r\n])*?)^---[\r\n]((.|[\r\n])*)/m;
    var text = asset.text;
    var mode = options.as ? options.as : "merge";
    var meta;

    if (text.indexOf('---') === 0) {
      var matches = text.match(re);
      if (matches) {
        try {
          meta = CSON.parseSync(matches[1]);
        } catch (err) {
          return cb(err);
        }

        if (mode === "property") {
          asset._meta = meta;
        } else {
          // task's pipeline looks for this hidden property
          asset.__merge = meta;
        }
        asset.text = matches[3] ? matches[3] : "";
      }
    }
    cb();
  };

  return ExtractMeta;
};
