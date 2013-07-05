/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var FileAsset, Filter, assert, ctorFactory, process, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, ctorFactory = _ref.ctorFactory, FileAsset = _ref.FileAsset;

Filter = ctorFactory("../lib/tutdown");

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

describe("tutdown", function() {
  it("should convert markdown to HTML", function(done) {
    var asset;
    asset = textAsset('Hello world!');
    return process(asset, {
      assetsDirname: __dirname + '/_assets'
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result, "<p>Hello world!</p>\n");
      return done();
    });
  });
  return it("should return error if layout is not found", function() {
    var asset;
    asset = textAsset('Hello world!');
    return assert.throws(function() {
      return process(asset, {
        layout: __dirname + '/res/dummylayout.html',
        assetsDirname: __dirname + '/_assets'
      }, function(err) {
        return assert.isNotNull(err);
      });
    });
  });
});
