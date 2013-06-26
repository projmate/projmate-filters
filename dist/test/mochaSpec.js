/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var $, Assets, Filter, Fs, assert, eventBus, mocha, readFileInt, _ref;

_ref = require("./helper"), $ = _ref.$, assert = _ref.assert, readFileInt = _ref.readFileInt, Assets = _ref.Assets, Filter = _ref.Filter, eventBus = _ref.eventBus;

mocha = Filter("../lib/mocha");

Fs = require('fs');

describe("Mocha", function() {
  return it("should run tests", function(done) {
    var assets, output, task;
    assets = new Assets;
    assets.create({
      filename: "" + __dirname + "/res/mocha/aSpec.coffee"
    });
    assets.create({
      filename: "" + __dirname + "/res/mocha/bTest.js"
    });
    output = [];
    eventBus.on('mochaping', function(val) {
      return output.push(val);
    });
    task = {
      assets: assets
    };
    return mocha.process(task, {
      globals: ['foo']
    }, function(err) {
      assert.ifError(err);
      assert.equal(output.length, 4);
      assert.isTrue(output.indexOf('a1') > -1);
      assert.isTrue(output.indexOf('b2') > -1);
      delete global.foo;
      return done();
    });
  });
});
