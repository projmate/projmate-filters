# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#
coffee  = require("coffee-script")
_ = require ("lodash")

module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  # Compiles CoffeeScript to JavaScript.
  #
  class Coffee extends Projmate.Filter
    extnames: ".coffee"
    outExtname: ".js"

    process: (asset, opts, cb) ->
      options = _.clone(opts)

      options.sourceMap = options.map if options.map?
      if options.sourceMap
        options.filename = asset.filename

      try
        result = coffee.compile(asset.text, options)
        if result.v3SourceMap
          js = result.js
          sourceMap = result.v3SourceMap

          # add new asset for map
          asset.parent.create filename: Utils.changeExtname(asset.filename, ".map"), text: sourceMap
        else
          js = result

        cb null, js
      catch ex
        cb ex
