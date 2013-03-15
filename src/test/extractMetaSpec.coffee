{assert, Assertion} = require("chai")
Assertion.includeStack = true

factory = require("../lib/extractMeta")
Projmate = require("projmate-core/dist")
{FileAsset} = Projmate
ExtractMeta = factory(Projmate)

textAsset = (text) ->
  new FileAsset(filename: "notused.html", text: text, parent: [])


describe "extractMeta", ->
  it "should extract meta and assign to ._meta", (done) ->
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
      pp.process asset, {as: "property"}, (err, result) ->
        assert.ifError err
        assert.equal asset._meta.foo, 1
        assert.equal asset._meta.baz[2], 3
        assert.equal asset.text, """
        one
        two
        """
        done()

  it "should extract meta and assign to .__merge", (done) ->
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
        assert.equal asset.__merge.foo, 1
        assert.equal asset.__merge.baz[2], 3
        assert.equal asset.text, """
        one
        two
        """
        done()

