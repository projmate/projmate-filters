# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#

less = require("less")
_ = require("lodash")
path = require("path")

module.exports = (Projmate) ->

  # Compiles a less buffer.
  class Less extends Projmate.Filter
    extnames: ".less"
    outExtname: ".css"

    process: (asset, options, cb) ->
      options = _.defaults(options, paths: [asset.dirname], compress: false)

      try
        parser = new less.Parser(options)
        parser.parse asset.text, (err, tree) ->
          return cb(err) if err
          try
            css = tree.toCSS(options)
            cb null, css
          catch ex
            cb ex
      catch ex
        cb ex

