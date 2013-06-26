/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var FileAsset, Filter, assert, ctorFactory, process, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, ctorFactory = _ref.ctorFactory, FileAsset = _ref.FileAsset;

Filter = ctorFactory("../lib/markdown");

textAsset = function(text) {
  return new FileAsset({
    filename: "notused.md",
    text: text,
    parent: []
  });
};

process = function(asset, options, cb) {
  var filter;
  filter = new Filter;
  return filter.process(asset, options, cb);
};

describe("markdown", function() {
  it("should convert markdown to HTML", function(done) {
    var asset;
    asset = textAsset('Hello world!');
    return process(asset, {}, function(err, result) {
      assert.ifError(err);
      assert.equal(result, "<p>Hello world!</p>\n");
      return done();
    });
  });
  it("should use a layout", function(done) {
    var asset;
    asset = textAsset('Hello world!');
    return process(asset, {
      layout: __dirname + '/res/layout.html'
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result.trim(), "<div><p>Hello world!</p>\n</div>");
      return done();
    });
  });
  return it("should return error if layout is not found", function(done) {
    var asset;
    asset = textAsset('Hello world!');
    return process(asset, {
      layout: __dirname + '/res/dummylayout.html'
    }, function(err) {
      assert.isNotNull(err);
      return done();
    });
  });
});
