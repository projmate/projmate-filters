/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Assertion, FileAsset, Projmate, Template, assert, factory, textAsset, _ref;

_ref = require("chai"), assert = _ref.assert, Assertion = _ref.Assertion;

Assertion.includeStack = true;

factory = require("../lib/template");

Projmate = require("projmate-core/dist");

FileAsset = Projmate.FileAsset;

Template = factory(Projmate);

textAsset = function(text) {
  return new FileAsset({
    filename: "notused.html",
    text: text,
    parent: []
  });
};

describe("extractMeta", function() {
  return it("should extract meta and assign to ._meta", function() {});
});
