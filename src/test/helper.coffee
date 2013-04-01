{assert, Assertion} = require("chai")
Assertion.includeStackTrace = true
Fs = require("fs")

Projmate = require("projmate-core/dist")
Assets = require("projmate-core/dist/lib/run/assets")
{EventEmitter} = require('events')

module.exports = Helper =
  assert: assert

  Projmate: Projmate

  ctorFactory: (path) ->
    factory = require(path)
    factory(Projmate)

  FileAsset: Projmate.FileAsset

  Filter: (path) ->
    factory = require(path)
    FilterClass = factory(Projmate)

    # return a wrapper for the filter's process function
    process: (asset, options, cb) ->
      filter = new FilterClass
      filter.process asset, options, cb

  textAsset: (text) ->
    assets = new Assets
    assets.create filename: "notused.txt", text: text

  Assets: Assets

  eventBus: new EventEmitter

  $: require("projmate-shell")


