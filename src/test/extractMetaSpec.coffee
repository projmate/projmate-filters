##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

{assert, Assertion} = require("chai")
Assertion.includeStack = true
Fs = require("fs")

factory = require("../lib/extractMeta")
Projmate = require("projmate-core/dist")
{FileAsset} = Projmate
ExtractMeta = factory(Projmate)

textAsset = (text) ->
  new FileAsset(filename: "notused.html", text: text, parent: [])


describe "extractMeta", ->
  it "should extract meta and assign to .__meta", (done) ->
      asset = textAsset """
        ---
        foo: (1)
        bar: "baz"
        baz:  [1, 2, 3]
        ---
        one
        two
        """
      pp = new ExtractMeta
      pp.process asset, {as: "moo"}, (err, result) ->
        assert.ifError err
        assert.equal asset.__meta.name, 'moo'
        assert.equal asset.__meta.meta.foo, 1
        assert.equal asset.__meta.meta.baz[2], 3
        assert.equal asset.text, """
        one
        two
        """
        done()

  it "should extract meta and assign to .__filterOptions (merges with options)", (done) ->
      asset = textAsset """
        ---
        foo: 1
        bar: "baz"
        baz:  [1, 2, 3]
        ---
        one
        two
        """
      pp = new ExtractMeta
      pp.process asset, {}, (err, result) ->
        assert.ifError err
        assert.equal asset.__filterOptions.foo, 1
        assert.equal asset.__filterOptions.baz[2], 3
        assert.equal asset.text, """
        one
        two
        """
        done()


  it "should extract meta from object", (done) ->
      asset = textAsset "Hello"
      pp = new ExtractMeta
      pp.process asset, from: {bah: "baz"}, (err, result) ->
        assert.ifError err
        assert.equal asset.__filterOptions.bah, "baz"
        assert.equal asset.text, "Hello"
        done()


