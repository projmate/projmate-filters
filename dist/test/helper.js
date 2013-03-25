/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Assertion, Assets, Fs, Projmate, assert, _ref;

_ref = require("chai"), assert = _ref.assert, Assertion = _ref.Assertion;

Assertion.includeStackTrace = true;

Fs = require("fs");

Projmate = require("projmate-core/dist");

Assets = require("projmate-core/dist/lib/run/assets");

module.exports = {
  assert: assert,
  Projmate: Projmate,
  ctorFactory: function(path) {
    var factory;

    factory = require(path);
    return factory(Projmate);
  },
  FileAsset: Projmate.FileAsset,
  Filter: function(path) {
    var FilterClass, factory;

    factory = require(path);
    FilterClass = factory(Projmate);
    return {
      process: function(asset, options, cb) {
        var filter;

        filter = new FilterClass;
        return filter.process(asset, options, cb);
      }
    };
  },
  textAsset: function(text) {
    var assets;

    assets = new Assets;
    return assets.create({
      filename: "notused.txt",
      text: text
    });
  },
  Assets: Assets,
  readFileInt: function(path) {
    var n, text;

    text = Fs.existsSync(path) ? Fs.readFileSync(path, "utf8") : "";
    n = parseInt(text);
    if (isNaN(n)) {
      return 0;
    } else {
      return n;
    }
  },
  addFileInt: function(path, value) {
    var total;

    total = module.exports.readFileInt(path);
    total += value;
    return Fs.writeFileSync(path, total);
  },
  $: require("projmate-shell")
};


/*
//@ sourceMappingURL=helper.map
*/