{assert, ctorFactory, FileAsset} = require("./helper")

Filter = ctorFactory("../lib/tutdown")

textAsset = (text) ->
  new FileAsset(filename: "notused.md", text: text, parent: [])

process = (asset, options, cb) ->
  filter = new Filter
  filter.process asset, options, cb

describe "tutdown", ->

  it "should convert markdown to HTML", (done) ->
    asset = textAsset('Hello world!')
    process asset, {}, (err, result) ->
      assert.ifError err
      assert.equal result, "<p>Hello world!</p>\n"
      done()

  it "should use a layout", (done) ->
    asset = textAsset('Hello world!')
    process asset, {layout: __dirname + '/res/layout.html'}, (err, result) ->
      assert.ifError err
      assert.equal result.trim(), "<div><p>Hello world!</p>\n</div>"
      done()

  it "should return error if layout is not found", ->
    asset = textAsset('Hello world!')
    assert.throws ->
      process asset, {layout: __dirname + '/res/dummylayout.html'}, (err) ->
        assert.isNotNull err
