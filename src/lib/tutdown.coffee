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
      @extnames = [".md", ".js", ".coffee"]
      @outExtname = ".html"
      super

    defaults:
      dev:
        navHeaderTemplate:
          """
          <a href='index.html'>
            <div class='nav-title'>API Docs</div>
          </a>
          """
        contentHeaderTemplate:
          """
          <a href='index.html'>
            <img id='logo' src='img/logo.png'/>
          </a>
          """
        contentFooterTemplate:
          """
          <script>
            (function() {
              var b = document.createElement("script"); b.type = "text/javascript"; b.async = true;
              b.src = "//barc.com/js/libs/barc/barc.js";
              var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(b, s);
            })();
          </script>
          """

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


