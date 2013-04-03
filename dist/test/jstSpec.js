/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Filter, assert, template, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

template = Filter("../lib/jst");

describe("template", function() {
  it("compile a template and default to 'it' as only argument", function(done) {
    var asset;

    asset = textAsset("<html>\n<% var code = 0; %>\n<%= it.name %>\n<%- '<raw>' %>\n</html>");
    return template.process(asset, {
      jst: true
    }, function(err) {
      assert.ifError(err);
      assert.isTrue(asset.text.indexOf('<%') < 0);
      assert.isTrue(asset.text.indexOf('(it)') > 0);
      assert.ok(asset.text.match(/\bit\.name/));
      assert.isTrue(asset.text.indexOf('module.exports') > 0);
      return done();
    });
  });
  return it("should compile with a function header", function(done) {
    var asset;

    asset = textAsset("<!--function(user)-->\n<html>\n<% var code = 0; %>\n<%= user.name %>\n<%- '<raw>' %>\n</html>");
    return template.process(asset, {
      jst: true
    }, function(err) {
      assert.ifError(err);
      assert.isTrue(asset.text.indexOf('<%') < 0);
      assert.isTrue(asset.text.indexOf('(user)') > 0);
      assert.ok(asset.text.match(/\buser\.name/));
      assert.isTrue(asset.text.indexOf('module.exports') > 0);
      return done();
    });
  });
});
