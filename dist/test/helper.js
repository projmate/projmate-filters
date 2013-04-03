/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Assertion, Assets, EventEmitter, Fs, Helper, Projmate, assert, _, _ref;

_ref = require("chai"), assert = _ref.assert, Assertion = _ref.Assertion;

Assertion.includeStackTrace = true;

Fs = require("fs");

_ = require('lodash');

Projmate = require("projmate-core/dist");

Assets = require("projmate-core/dist/lib/run/assets");

EventEmitter = require('events').EventEmitter;

module.exports = Helper = {
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
  textAsset: function(textOrOptions) {
    var assets;

    assets = new Assets;
    if (_.isString(textOrOptions)) {
      return assets.create({
        filename: "notused.txt",
        text: textOrOptions
      });
    } else {
      return assets.create(textOrOptions);
    }
  },
  Assets: Assets,
  eventBus: new EventEmitter,
  $: require("projmate-shell")
};
