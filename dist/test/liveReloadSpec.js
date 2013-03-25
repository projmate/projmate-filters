/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Filter, assert, liveReload, textAsset, _ref;

_ref = require("./helper"), assert = _ref.assert, textAsset = _ref.textAsset, Filter = _ref.Filter;

liveReload = Filter("../lib/liveReload");

describe("Coffee", function() {
  return it("should add header", function(done) {
    var asset;

    asset = textAsset("<html><head></head><body></body></html>");
    return liveReload.process(asset, {
      domain: 'localhost',
      port: 1337
    }, function(err, result) {
      var end, mid, start;

      start = result.indexOf("<html><head>");
      mid = result.indexOf("localhost:1337/livereload.js");
      end = result.indexOf("</head><body></body></html>");
      assert.isTrue(start > -1 && start < mid && mid < end);
      return done();
    });
  });
});


/*
//@ sourceMappingURL=liveReloadSpec.map
*/