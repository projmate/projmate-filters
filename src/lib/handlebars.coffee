##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require("path")

module.exports = (Projmate) ->
  _ = require("lodash")
  hbs = require("../support/express-hbs/hbs")

  # Compiles many types of Handlebarss to HTML using consolidate.
  #
  class Handlebars extends Projmate.Filter
    constructor: ->
      @extnames = ".hbs"
      @outExtname = ".html"
      super

    process: (asset, options, cb) ->
      return cb("options.root is required") unless options.root
      _.defaults options, extname: ".hbs"

      unless @render
        config = _.clone(options)
        @render = hbs.init(config)

      @render asset.filename, asset.text, options, cb

