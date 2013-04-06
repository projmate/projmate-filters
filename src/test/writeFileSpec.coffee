{assert, textAsset, Filter} = require("./helper")

filter = Filter("../lib/writeFiles")
fs = require('fs')

describe "template", ->

  it "should write an asset", (done) ->
    filename = __dirname + '/tmp/writefile1.txt'
    asset = textAsset text: 'foo', filename: filename
    filter.process asset, {}, (err, result) ->
      assert.ifError err
      text = fs.readFileSync(filename, 'utf8')
      assert.equal text, 'foo'
      fs.unlinkSync filename
      done()

  it "should write an asset without extension", (done) ->
    filename = __dirname + '/tmp/writeFile2'
    asset = textAsset text: 'foo2', filename: filename
    filter.process asset, {}, (err, result) ->
      assert.ifError err
      text = fs.readFileSync(filename, 'utf8')
      assert.equal text, 'foo2'
      fs.unlinkSync filename
      done()

