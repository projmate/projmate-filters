{assert, textAsset, Filter} = require("./helper")

coffee = Filter("../lib/coffee")

describe "Coffee", ->

  it "should handle simple coffee", (done) ->
    asset = textAsset("a=1")
    coffee.process asset, {bare: true}, (err, result) ->
      assert.isTrue result.indexOf("var a;") >= 0
      assert.isTrue result.indexOf("a = 1;") >= 0
      done()


  it "should create sourcemaps", (done) ->
    asset = textAsset("a=1")
    assets = asset.parent
    assert.equal asset.parent.length, 1

    coffee.process asset, {bare: true, sourceMap: true}, (err, result) ->
      assert.ifError err
      # should have a javascript asset and map asset
      assert.equal assets.length, 2
      assert.isTrue result.indexOf("sourceMappingURL=notused.map") > 0
      assert.isTrue assets[1].text.indexOf('"mappings"') > 0
      assert.equal assets[1].extname, ".map"
      done()
