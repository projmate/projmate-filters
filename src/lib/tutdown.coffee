##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require("path")
Fs = require("fs")

module.exports = (Projmate) ->
  tutdown = require("tutdown")

  schema =
    title: 'Creates awesome docuementation from Coffee, JS, and Markdown'
    type: 'object'
    properties:
      assetsDirname:
        type: 'string'
        description: 'Directory to write assets'

    __:
      extnames: ['.md', '.js', '.coffee']
      outExtname: '.html'

  # Compiles markdown to HTML, optionally inserting the
  # file into a layout.
  class Markdown extends Projmate.Filter
    # constructor: ->
    #   @extnames = [".md", ".js", ".coffee"]
    #   @outExtname = ".html"
    #   super

    @schema: schema

    # Process the markdown, optionally inserting it into a layout.
    process: (asset, options, cb) ->
      options.assetsDirname = asset.dirname + '/_assets'
      options.assetPrefix = Path.basename(asset.basename, asset.extname)
      if options.layout
        options.docLayoutFile = options.layout

      if asset.extname == ".md"
        tutdown.render asset.text, options, cb
      else
        if asset.extname == ".coffee"
          options.coffeeScript = true
        tutdown.renderApi asset.text, options, (err, result) ->
          return cb(err) if err
          {content, nav} = result
          asset.nav = nav
          cb null, text: content, extname: ".html"


