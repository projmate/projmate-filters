##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

_ = require("lodash")

module.exports = (Projmate) ->
  UglifyJS = require("uglify-js")

  schema =
    title: 'Minifies JavaScript'
    type: 'object'

    __:
      extnames: ".js"
      outExtname: ".js"

  # Minifies JavaScript files.
  #
  class Uglify extends Projmate.Filter
    @schema: schema

    process: (asset, options, cb) ->
      options = _.defaults(options, fromString: true)
      try
        result = UglifyJS.minify(asset.text, options)
        cb null, result.code
      catch ex
        cb ex




