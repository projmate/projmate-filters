/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var FileAsset, PreProcessor, assert, ctorFactory, process, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, ctorFactory = _ref.ctorFactory, FileAsset = _ref.FileAsset;

PreProcessor = ctorFactory("../lib/preproc");

textAsset = function(text) {
  return new FileAsset({
    filename: "notused.txt",
    text: text,
    parent: []
  });
};

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
  return it("should use defines", function(done) {
    var asset;

    asset = textAsset("#ifdef FOO\nbar\n#else\nbad\n#endif\n#define WIN\n#ifdef WIN\nwindows\n#endif");
    return process(asset, {
      FOO: 1
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result, "bar\nwindows");
      return done();
    });
  });
});


/*
//@ sourceMappingURL=preprocSpec.map
*/