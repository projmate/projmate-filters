/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Filter, assert, filter, fs, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

filter = Filter("../lib/writeFiles");

fs = require('fs');

describe("template", function() {
  it("should write an asset", function(done) {
    var asset, filename;
    filename = __dirname + '/tmp/writefile1.txt';
    asset = textAsset({
      text: 'foo',
      filename: filename
    });
    return filter.process(asset, {}, function(err, result) {
      var text;
      assert.ifError(err);
      text = fs.readFileSync(filename, 'utf8');
      assert.equal(text, 'foo');
      fs.unlinkSync(filename);
      return done();
    });
  });
  return it("should write an asset without extension", function(done) {
    var asset, filename;
    filename = __dirname + '/tmp/writeFile2';
    asset = textAsset({
      text: 'foo2',
      filename: filename
    });
    return filter.process(asset, {}, function(err, result) {
      var text;
      assert.ifError(err);
      text = fs.readFileSync(filename, 'utf8');
      assert.equal(text, 'foo2');
      fs.unlinkSync(filename);
      return done();
    });
  });
});
