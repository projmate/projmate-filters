{assert, textAsset, Filter} = require("./helper")

liveReload = Filter("../lib/liveReload")

describe "Coffee", ->

  it "should add header", (done) ->
    asset = textAsset("<html><head></head><body></body></html>")
    liveReload.process asset, {domain: 'localhost', port: 1337}, (err, result) ->
      start = result.indexOf("<html><head>")
      mid = result.indexOf("localhost:1337/livereload.js")
      end = result.indexOf("</head><body></body></html>")
      assert.isTrue start > -1 and start < mid and mid < end
      done()
