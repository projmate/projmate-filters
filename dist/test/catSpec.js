var Assets, Filter, assert, cat, _ref;

_ref = require("./helper"), assert = _ref.assert, Assets = _ref.Assets, Filter = _ref.Filter;

cat = Filter("../lib/cat");

describe("Cat", function() {
  return it("should handle concat", function(done) {
    var assets, task;
    assets = new Assets;
    assets.create({
      filename: "notused.ext",
      text: "b"
    });
    assets.create({
      filename: "notused.ext",
      text: "x"
    });
    assets.create({
      filename: "notused.ext",
      text: "c"
    });
    assets.create({
      filename: "notused.ext",
      text: "d"
    });
    task = {
      assets: assets
    };
    return cat.process(task, {
      filename: "foo.ext"
    }, function(err, result) {
      assert.equal(assets.size(), 1);
      assert.equal(result.text, "bxcd");
      assert.equal(result.filename, "foo.ext");
      assert.equal(assets.at(0).filename, "foo.ext");
      assert.equal(assets.at(0).text, "bxcd");
      return done();
    });
  });
});


/*
//@ sourceMappingURL=catSpec.map
*/