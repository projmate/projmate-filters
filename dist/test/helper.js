/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Assertion, Assets, Projmate, assert, _ref;

_ref = require("chai"), assert = _ref.assert, Assertion = _ref.Assertion;

Assertion.includeStackTrace = true;

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
  Assets: Assets
};
