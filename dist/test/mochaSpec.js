/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var $, Assets, Filter, assert, mocha, readFileInt, _ref;

_ref = require("./helper"), $ = _ref.$, assert = _ref.assert, readFileInt = _ref.readFileInt, Assets = _ref.Assets, Filter = _ref.Filter;

mocha = Filter("../lib/mocha");

describe("Mocha", function() {
  return it("should run tests", function(done) {
    var assets, task;

    assets = new Assets;
    assets.create({
      filename: "" + __dirname + "/res/mocha/aTest.js"
    });
    assets.create({
      filename: "" + __dirname + "/res/mocha/aSpec.coffee"
    });
    assets.create({
      filename: "" + __dirname + "/res/mocha/globalTest.coffee"
    });
    task = {
      assets: assets
    };
    return mocha.process(task, {
      globals: "foo,bar"
    }, function(err) {
      var filename, total;

      assert.ifError(err);
      filename = "" + __dirname + "/res/mocha/result";
      total = readFileInt(filename);
      $.rm(filename);
      assert.equal(total, 6);
      delete global.foo;
      return done();
    });
  });
});


/*
//@ sourceMappingURL=src/test/mochaSpec.map
*/