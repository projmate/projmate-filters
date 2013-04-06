{assert, textAsset, Filter} = require("./helper")

filter = Filter("../lib/functoid")

describe "Functoid", ->

  it "should call custom command", (done) ->
    asset = textAsset(text: '#container= name', filename: 'test.jade')

    adhoc = (asset, options, cb) ->
      asset.text = 'ADHOC'
      cb null, text: 'ADHOC', extname: '.foo'

    filter.process asset, {command: adhoc}, (err, result) ->
      assert.ifError err
      assert.equal result.text, 'ADHOC'
      assert.equal result.extname, '.foo'
      done()

  it "should call custom command without callback", (done) ->
    asset = textAsset(text: '#container= name', filename: 'test.jade')

    adhoc = (asset) ->
      asset.text = 'NOCB'

    filter.process asset, {command: adhoc}, (err, result) ->
      assert.ifError err
      assert.equal result, 'NOCB'
      assert.equal asset.text, 'NOCB'
      done()
