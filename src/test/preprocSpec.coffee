##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Fs = require('fs')
{assert, ctorFactory, FileAsset, textAsset} = require("./helper")

PreProcessor = ctorFactory("../lib/preproc")

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

  it "should include", (done) ->
    filename = __dirname + '/res/preproc.txt'
    asset = textAsset(filename: filename, text: Fs.readFileSync(filename, 'utf8'))
    process asset, FOO:1, (err, result) ->
      assert.ifError err
      assert.equal result, "#comment\nbar\nwindows\nhello\\s\n\n"
      done()

  it "should include with string filters", (done) ->
    filename = __dirname + '/res/preproc-filter.txt'
    asset = textAsset(filename: filename, text: Fs.readFileSync(filename, 'utf8'))
    process asset, FOO:1, (err, result) ->
      assert.ifError err
      assert.equal result, "#comment\nbar\nwindows\nhello\\\\s\n\n"
      done()

  it "should user user defined filters", (done) ->
    filename = __dirname + '/res/preproc-udf.txt'
    asset = textAsset(filename: filename, text: Fs.readFileSync(filename, 'utf8'))
    caps = (s) -> s.toUpperCase()
    process asset, caps:caps, (err, result) ->
      assert.ifError err
      assert.equal result.trim(), "HELLO\\S"
      done()











