{assert, Assertion} = require("chai")
Assertion.includeStackTrace = true
Fs = require("fs")

Projmate = require("projmate-core/dist")
Assets = require("projmate-core/dist/lib/run/assets")

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
    assets = new Assets
    assets.create filename: "notused.txt", text: text

  Assets: Assets


  # Reads integer from file
  readFileInt: (path) ->
    text = if Fs.existsSync(path) then Fs.readFileSync(path, "utf8") else ""
    n = parseInt(text)
    if isNaN(n) then 0 else n

  # Adds to integer in file
  addFileInt: (path, value) ->
    total = module.exports.readFileInt(path)
    total += value
    Fs.writeFileSync path, total

  $: require("projmate-shell")


