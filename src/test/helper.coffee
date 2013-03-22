{assert, Assertion} = require("chai")
Assertion.includeStackTrace = true

Projmate = require("projmate-core/dist")
{createAssets} = require("projmate-core/dist/lib/run/assets")

module.exports =
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
    assets = createAssets()
    assets.create filename: "notused.txt", text: text