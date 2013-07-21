var Filter, assert, filter, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

filter = Filter("../lib/tap");

describe("Tap", function() {
  it("should call custom command", function(done) {
    var adhoc, asset;
    asset = textAsset({
      text: '#container= name',
      filename: 'test.jade'
    });
    adhoc = function(asset, options, cb) {
      asset.text = 'ADHOC';
      return cb(null, {
        text: 'ADHOC',
        extname: '.foo'
      });
    };
    return filter.process(asset, {
      command: adhoc
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result.text, 'ADHOC');
      assert.equal(result.extname, '.foo');
      return done();
    });
  });
  return it("should call custom command without callback", function(done) {
    var adhoc, asset;
    asset = textAsset({
      text: '#container= name',
      filename: 'test.jade'
    });
    adhoc = function(asset) {
      return asset.text = 'NOCB';
    };
    return filter.process(asset, {
      command: adhoc
    }, function(err) {
      assert.ifError(err);
      assert.equal(asset.text, 'NOCB');
      return done();
    });
  });
});


/*
//@ sourceMappingURL=tapSpec.map
*/