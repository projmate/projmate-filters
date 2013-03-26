{assert, textAsset, Filter} = require("./helper")

handlebars = Filter("../lib/liveReload")

describe "handlebars", ->

  it "compile a template", (done) ->
    asset = textAsset("<html><head></head><body></body></html>")
    liveReload.process asset, {domain: 'localhost', port: 1337}, (err, result) ->
      start = result.indexOf("<html><head>")
      mid = result.indexOf("localhost:1337/livereload.js")
      end = result.indexOf("</head><body></body></html>")
      assert.isTrue start > -1 and start < mid and mid < end
      done()
