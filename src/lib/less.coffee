# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#

_ = require("lodash")
path = require("path")


module.exports = (Projmate) ->
  {Parser} = require("less")

  # Compiles a less buffer.
  class Less extends Projmate.Filter
    extnames: ".less"
    outExtname: ".css"
    defaults:
      development: {dumpLineNumbers: "comments", compress: false}
      production: {compress: true}

    process: (asset, options, cb) ->
      options.filename = asset.filename
      options.paths = [asset.dirname]

      try
        parser = new Parser(options)
        parser.parse asset.text, (err, tree) ->
          return cb(err) if err
          try
            css = tree.toCSS(options)
            cb null, css
          catch ex
            cb ex
      catch ex
        cb ex

