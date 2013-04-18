/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Filter, assert, template, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

template = Filter("../lib/jade");

describe("template", function() {
  return it("compile a template and default to 'it' as only argument", function(done) {
    var asset;

    asset = textAsset({
      text: '#container= name',
      filename: 'test.jade'
    });
    return template.process(asset, {
      jst: true
    }, function(err, result) {
      assert.ifError(err);
      return done();
    });
  });
});