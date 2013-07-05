##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require("path")

module.exports = (Projmate) ->

  schema =
    title: 'Compiles handlebars templates'
    type: 'object'
    properties:
      root:
        type: 'string'
        description: 'Root directory for relative templates and partials'
      required: ['root']
    __:
      extnames: ".hbs"
      outExtname: ".html"

  # Compiles many types of Handlebarss to HTML using consolidate.
  #
  class Handlebars extends Projmate.Filter
    @schema = schema

    process: (asset, options, cb) ->
      return cb("options.root is required") unless options.root

      _ = require("lodash")
      hbs = require("../support/express-hbs/hbs")
      _.defaults options, extname: ".hbs"

      unless @render
        config = _.clone(options)
        config.cache = false
        @render = hbs.init(config)

      @render asset.filename, asset.text, options, cb


