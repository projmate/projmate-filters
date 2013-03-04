##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#

coffee  = require("coffee-script")

module.exports = (Projmate) ->

  ##
  # Compiles CoffeeScript to JavaScript.
  #
  class Coffee extends Projmate.Filter
    extnames: ".coffee"
    outExtname: ".js"

    process: (asset, options, cb) ->
      try
        js = coffee.compile(asset.text, options)
        cb null, js
      catch ex
        cb ex



