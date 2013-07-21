var Filter, assert, template, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

template = Filter("../lib/template");

describe("template", function() {
  return it("should create a local named asset", function(done) {
    var asset;
    asset = textAsset("foobar");
    return template.process(asset, {
      text: "Hello <%= asset.text %>"
    }, function(err, result) {
      assert.equal(result, "Hello foobar");
      return done();
    });
  });
});


/*
//@ sourceMappingURL=templateSpec.map
*/