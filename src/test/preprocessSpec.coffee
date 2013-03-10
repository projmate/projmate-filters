{assert} = require("chai")

factory = require("../lib/preprocess")
Projmate = require("projmate-core/dist")
{FileAsset} = Projmate
PreProcess = factory(Projmate)

textAsset = (text) ->
  new FileAsset(filename: "notused.txt", text: text, parent: [])

describe "PreProcess", ->
  it "should return original text in absence of directives", (done) ->
    asset = textAsset("foobar")
    pp = new PreProcess
    pp.process asset, {}, (err, result) ->
      assert.ifError err
      assert.equal result, "foobar"
      done()

  it "should use defines", (done) ->
    asset = textAsset("""
      #ifdef FOO
      bar
      #else
      bad
      #endif
      #define WIN
      #ifdef WIN
      windows
      #endif
    """)
    pp = new PreProcess
    pp.process asset, FOO:1, (err, result) ->
      assert.ifError err
      assert.equal result, "bar\nwindows"
      done()











