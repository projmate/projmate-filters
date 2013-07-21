var Assertion, ExtractMeta, FileAsset, Fs, Projmate, assert, factory, textAsset, _ref;

_ref = require("chai"), assert = _ref.assert, Assertion = _ref.Assertion;

Assertion.includeStack = true;

Fs = require("fs");

factory = require("../lib/extractMeta");

Projmate = require("projmate-core/dist");

FileAsset = Projmate.FileAsset;

ExtractMeta = factory(Projmate);

textAsset = function(text) {
  return new FileAsset({
    filename: "notused.html",
    text: text,
    parent: []
  });
};

describe("extractMeta", function() {
  it("should extract meta and assign to .__meta", function(done) {
    var asset, pp;
    asset = textAsset("---\nfoo: (1)\nbar: \"baz\"\nbaz:  [1, 2, 3]\n---\none\ntwo");
    pp = new ExtractMeta;
    return pp.process(asset, {
      as: "moo"
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(asset.__meta.name, 'moo');
      assert.equal(asset.__meta.meta.foo, 1);
      assert.equal(asset.__meta.meta.baz[2], 3);
      assert.equal(asset.text, "one\ntwo");
      return done();
    });
  });
  it("should extract meta and assign to .__filterOptions (merges with options)", function(done) {
    var asset, pp;
    asset = textAsset("---\nfoo: 1\nbar: \"baz\"\nbaz:  [1, 2, 3]\n---\none\ntwo");
    pp = new ExtractMeta;
    return pp.process(asset, {}, function(err, result) {
      assert.ifError(err);
      assert.equal(asset.__filterOptions.foo, 1);
      assert.equal(asset.__filterOptions.baz[2], 3);
      assert.equal(asset.text, "one\ntwo");
      return done();
    });
  });
  return it("should extract meta from object", function(done) {
    var asset, pp;
    asset = textAsset("Hello");
    pp = new ExtractMeta;
    return pp.process(asset, {
      from: {
        bah: "baz"
      }
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(asset.__filterOptions.bah, "baz");
      assert.equal(asset.text, "Hello");
      return done();
    });
  });
});


/*
//@ sourceMappingURL=extractMetaSpec.map
*/