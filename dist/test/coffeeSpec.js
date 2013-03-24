/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Filter, assert, coffee, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

coffee = Filter("../lib/coffee");

describe("Coffee", function() {
  it("should handle simple coffee", function(done) {
    var asset;

    asset = textAsset("a=1");
    return coffee.process(asset, {
      bare: true
    }, function(err, result) {
      assert.isTrue(result.indexOf("var a;") >= 0);
      assert.isTrue(result.indexOf("a = 1;") >= 0);
      return done();
    });
  });
  return it("should create sourcemaps", function(done) {
    var asset, assets;

    asset = textAsset("a=1");
    assets = asset.parent;
    assert.equal(asset.parent.size(), 1);
    return coffee.process(asset, {
      bare: true,
      sourceMap: true,
      $inspect: true
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(assets.size(), 2);
      assert.isTrue(result.indexOf("sourceMappingURL=notused.map") > 0);
      assert.isTrue(assets.at(1).text.indexOf('"mappings"') > 0);
      assert.equal(assets.at(1).extname, ".map");
      return done();
    });
  });
});


/*
//@ sourceMappingURL=src/test/coffeeSpec.map
*/