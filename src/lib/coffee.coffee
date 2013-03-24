##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

coffee  = require("coffee-script")
_ = require ("lodash")
{defer} = require("when")
Path = require("path")


module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  # Compiles CoffeeScript to JavaScript.
  #
  class Coffee extends Filter
    extnames: [".coffee", ".litcoffee", ".coffee.md"]
    outExtname: ".js"
    defaults:
      # source maps are a good thing in development
      development: {sourceMap: true}
      production: {sourceMap: false}

    process: (asset, options, cb) ->
      if options.sourceMap
        options.filename = asset.filename
        # the coffee file in sourcemap
        options.sourceFiles = [asset.basename]
        # the generate js file
        options.generatedFile = Utils.changeExtname(asset.basename, ".js")

      try
        result = coffee.compile(asset.text, options)
        if result.v3SourceMap
          js = result.js
          sourceMap = result.v3SourceMap

          # Add sourcemap line
          js += """
          \n
          /*
          //@ sourceMappingURL=#{Utils.changeExtname(asset.filename, '.map')}
          */
          """

          # add new asset for map
          mapAsset = asset.parent.create(filename: Utils.changeExtname(asset.filename, ".map"), text: sourceMap)

          # The filename for source mapping is unknown until the time of writing. Replace it with
          # relative path.
          mapAsset.whenWriting ->
            relPath = Path.relative(Path.dirname(asset.filename), asset.originalFilename)
            mapAsset.text = mapAsset.text.replace(Path.basename(asset.originalFilename), relPath)

        else
          js = result

        cb null, js
      catch ex
        cb ex

