##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require('path')
_ = require('lodash')

module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  class Jst extends Projmate.Filter

    extnames: ['.jst', '.html', '.ejs']
    outExtname: ".html"
    defaults:
      development: { jst: true }


    @meta:
      description: """
        Compiles a buffer into a JavaScript function using the following
        directives:

        function(it, foo)   // must be first line

        <%= escaped %>
        <%- raw %>
        <% code %>
      """
      options:
        paramName:
          type: 'string'
          desc: 'The name of the single parameter to the function.'
          default: 'it'

    process: (asset, options, cb) ->
      options.variable = options.paramName || 'it'
      defaults =
        evaluate: /<%([\s\S]+?)%>/g
        interpolate: /<%-([\s\S]+?)%>/g
        escape: /<%=([\s\S]+?)%>/g

      _.defaults options, defaults


      # parse function declaration fom comment
      text = asset.text
      if text.indexOf('<!--function') == 0
        newlinePos = text.indexOf('\n')
        func = text.slice(0, newlinePos)
        func = func.match(/function[^-]*/)[0]
        text = text.slice(newlinePos+1)

      # lodash expects a variable to not use 'with', create one and delete after
      options.variable = 'SUPAHFLY' if func

      try
        compiled = _.template(text, null, options)
        text = compiled.source

        if func
          text = text.replace("function(SUPAHFLY)", func)
          text = text.replace(/SUPAHFLY\./g, '')

        fnName = Path.basename(asset.basename, asset.extname)

        asset.text = text.replace('function', "function #{fnName}") + "\nmodule.exports = #{fnName};"
        asset.filename = Utils.changeExtname(asset.filename, '.js')
        return cb()
      catch ex
        return cb ex



