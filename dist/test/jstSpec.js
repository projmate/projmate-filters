var Filter, assert, template, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

template = Filter("../lib/jst");

describe("jst", function() {
  it("compile a template and default to 'it' as only argument", function(done) {
    var asset;
    asset = textAsset("<html>\n<% var code = 0; %>\n<%= it.name %>\n<%- '<raw>' %>\n</html>");
    return template.process(asset, {
      jst: true
    }, function(err, result) {
      var text;
      assert.ifError(err);
      text = result.text;
      assert.isTrue(text.indexOf('<%') < 0);
      assert.isTrue(text.indexOf('(it)') > 0);
      assert.ok(text.match(/\bit\.name/));
      assert.isTrue(text.indexOf('module.exports') > 0);
      assert.equal(result.extname, '.js');
      return done();
    });
  });
  it("should compile with a function header", function(done) {
    var asset;
    asset = textAsset("<!--function(user)-->\n<html>\n<% var code = 0; %>\n<%= user.name %>\n<%- '<raw>' %>\n</html>");
    return template.process(asset, {
      jst: true
    }, function(err, result) {
      var text;
      assert.ifError(err);
      text = result.text;
      assert.isTrue(text.indexOf('<%') < 0);
      assert.isTrue(text.indexOf('(user)') > 0);
      assert.ok(text.match(/\buser\.name/));
      assert.isTrue(text.indexOf('module.exports') > 0);
      assert.equal(result.extname, '.js');
      return done();
    });
  });
  return it("should compile  simple text", function(done) {
    var asset;
    asset = textAsset('Hello <%= name %>');
    return template.process(asset, {
      jst: false,
      name: 'foo'
    }, function(err, result) {
      assert.ifError(err);
      assert.equal(result.text, 'Hello foo');
      assert.equal(result.extname, '.html');
      return done();
    });
  });
});


/*
//@ sourceMappingURL=jstSpec.map
*/