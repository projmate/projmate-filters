{assert, Assertion} = require("chai")
Assertion.includeStackTrace = true
Fs = require("fs")
_ = require('lodash')

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

  textAsset: (textOrOptions) ->
    assets = new Assets
    if _.isString(textOrOptions)
      assets.create filename: "notused.txt", text: textOrOptions
    else
      assets.create textOrOptions




  Assets: Assets

  eventBus: new EventEmitter

  $: require("projmate-shell")


