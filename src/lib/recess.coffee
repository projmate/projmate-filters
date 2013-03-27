##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

recess  = require("recess")

module.exports = (Projmate) ->

  # Compiles and compresses less and css using Twitter's
  # [recess](https://github.com/twitter/recess)
  #
  class Coffee extends Projmate.Filter
    extnames: [".css", ".less"]
    outExtname: ".css"

    process: (asset, options, cb) ->
      try
        recess asset.filename, options, (err, result) ->
          return cb(err) if (err)
          cb null, result.output
      catch ex
        cb ex

