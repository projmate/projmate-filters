{assert, textAsset, Filter} = require("./helper")

template = Filter("../lib/jade")

describe "template", ->

  it "compile a template and default to 'it' as only argument", (done) ->
    asset = textAsset(text: '#container= name', filename: 'test.jade')

    template.process asset, {jst: true}, (err, result) ->
      assert.ifError err
      done()
