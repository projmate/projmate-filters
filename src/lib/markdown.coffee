##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require("path")
Fs = require("fs")

module.exports = (Projmate) ->
  marked = require("marked")

  # Compiles markdown to HTML, optionally inserting the
  # file into a layout.
  class Markdown extends Projmate.Filter
    constructor: ->
      @extnames = ".md"
      @outExtname = ".html"

      @defaults =
        gfm: true
        tables: true
        breaks: false
        pedantic: false
        sanitize: true
        smartLists: true
        smartypants: false
        langPrefix: 'language-'

      super

    # Process the markdown, optionally inserting it into a layout.
    process: (asset, options, cb) ->
      try
        html = marked(asset.text)

        if options.layout
          @layouts ?= {}
          layout = @layouts[options.layout]
          if not layout
            layout = Fs.readFileSync(options.layout, "utf8")
            @layouts[options.layout] = layout

        if layout
          if layout.indexOf('{{{body}}}') < 0
            return cb('Layout does not define {{{body}}} placeholder')
          html = layout.replace('{{{body}}}', html)

        cb null, html
      catch err
        cb err
