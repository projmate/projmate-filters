var FileAsset, Fs, PreProcessor, assert, ctorFactory, process, textAsset, _ref;

Fs = require('fs');

_ref = require("./helper"), assert = _ref.assert, ctorFactory = _ref.ctorFactory, FileAsset = _ref.FileAsset, textAsset = _ref.textAsset;

PreProcessor = ctorFactory("../lib/preproc");

process = function(asset, options, cb) {
  var pp;
  pp = new PreProcessor;
  return pp.process(asset, options, cb);
};

describe("preproc", function() {
  it("should return original text in absence of directives", function(done) {
    var asset;
    asset = textAsset("foobar");
    return process(asset, {}, function(err, result) {
      assert.ifError(err);
      assert.equal(result, "foobar");
      return done();
    });
  });
  it("should include", function(done) {
    var asset, filename;
    filename = __dirname + '/res/preproc.txt';
    asset = textAsset({
      filename: filename,
      text: Fs.readFileSync(filename, 'utf8')
    });
    return process(asset, {
      FOO: 1
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result, "#comment\nbar\nwindows\nhello\\s\n\n");
      return done();
    });
  });
  it("should include with string filters", function(done) {
    var asset, filename;
    filename = __dirname + '/res/preproc-filter.txt';
    asset = textAsset({
      filename: filename,
      text: Fs.readFileSync(filename, 'utf8')
    });
    return process(asset, {
      FOO: 1
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result, "#comment\nbar\nwindows\nhello\\\\s\n\n");
      return done();
    });
  });
  return it("should user user defined filters", function(done) {
    var asset, caps, filename;
    filename = __dirname + '/res/preproc-udf.txt';
    asset = textAsset({
      filename: filename,
      text: Fs.readFileSync(filename, 'utf8')
    });
    caps = function(s) {
      return s.toUpperCase();
    };
    return process(asset, {
      caps: caps
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result.trim(), "HELLO\\S");
      return done();
    });
  });
});


/*
//@ sourceMappingURL=preprocSpec.map
*/