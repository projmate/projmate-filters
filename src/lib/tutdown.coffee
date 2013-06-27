##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require("path")
Fs = require("fs")

module.exports = (Projmate) ->
  tutdown = require("tutdown")

  # Compiles markdown to HTML, optionally inserting the
  # file into a layout.
  class Markdown extends Projmate.Filter
    constructor: ->
      @extnames = ".md"
      @outExtname = ".html"

      # @defaults =
      #   gfm: true
      #   tables: true
      #   breaks: false
      #   pedantic: false
      #   sanitize: true
      #   smartLists: true
      #   smartypants: false
      #   langPrefix: 'language-'

      super

    # Process the markdown, optionally inserting it into a layout.
    process: (asset, options, cb) ->
      opts =
        assetsDirname: asset.dirname + '/_assets'
      if options.layout
        opts.docLayoutFile = options.layout
      tutdown.render asset.text, opts, cb

