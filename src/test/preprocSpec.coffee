##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

{assert, ctorFactory, FileAsset} = require("./helper")

PreProcessor = ctorFactory("../lib/preproc")

textAsset = (text) ->
  new FileAsset(filename: "notused.txt", text: text, parent: [])

process = (asset, options, cb) ->
  pp = new PreProcessor
  pp.process asset, options, cb


describe "preproc", ->
  it "should return original text in absence of directives", (done) ->
    asset = textAsset("foobar")
    process asset, {}, (err, result) ->
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
    process asset, FOO:1, (err, result) ->
      assert.ifError err
      assert.equal result, "bar\nwindows"
      done()











