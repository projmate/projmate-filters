##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

UglifyJS = require("uglify-js")
_ = require("lodash")

module.exports = (Projmate) ->

  # Minifies JavaScript files.
  #
  class Uglify extends Projmate.Filter
    extnames: ".js"
    outExtname: ".js"

    process: (asset, options, cb) ->
      options = _.defaults(options, fromString: true)
      try
        result = UglifyJS.minify(asset.text, options)
        cb null, result.code
      catch ex
        cb ex




