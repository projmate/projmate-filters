{assert, textAsset, Filter} = require("./helper")

template = Filter("../lib/template")

describe "template", ->

  it "should create a local named asset", (done) ->
    asset = textAsset("foobar")

    template.process asset, text: "Hello <%= asset.text %>", (err, result) ->
      assert.equal result, "Hello foobar"
      done()
