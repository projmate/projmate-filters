##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require('path')
_ = require('lodash')
Fs = require('fs')

delimiters =
  # <% code %>
  # <%- raw %>
  # <%= escaped %>
  ejs:
    evaluate: /<%([\s\S]+?)%>/g
    interpolate: /<%-([\s\S]+?)%>/g
    escape: /<%=([\s\S]+?)%>/g

  # <? code ?>
  # <?- raw ?>
  # <?= escape ?>
  php:
    evaluate: /<\?([\s\S]+?)\?>/g
    interpolate: /<\?-([\s\S]+?)\?>/g
    escape: /<\?=([\s\S]+?)\?>/g


  mustache:
    interpolate: /{{{(.+?)}}}/g
    escape: /{{([^{]+?)}}/g



module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  class Jst extends Projmate.Filter

    extnames: ['*']
    outExtname: ".html"

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


    render: (asset, options, cb) ->
      options.asset = asset
      #options.variable = options.paramName || 'it'
      if options.delimiters and delimiters[options.delimiters]
        templateDelimiters = delimiters[options.delimiters]
      else
        templateDelimiters = delimiters.ejs

      if options.layout
        @cache ?= {}
        if @cache[options.layout]
          text = @cache[options.layout]
        else
          text = Fs.readFileSync(options.layout, 'utf8')
          @cache[options.layout] = text
      else
        text = asset.text

      # parse function declaration fom comment
      if text.indexOf('<!--function') == 0
        newlinePos = text.indexOf('\n')
        func = text.slice(0, newlinePos)
        func = func.match(/function[^-]*/)[0]
        text = text.slice(newlinePos+1)

      # lodash expects a variable to not use 'with', create one and delete after
      options.variable = 'SUPAHFLY' if func

      try
        _.extend _.templateSettings, templateDelimiters
        result = _.template(text, options)
        cb null, text: result, extname: '.html'
      catch ex
        return cb ex


    # Process asset
    process: (asset, options, cb) ->
      if options.jst

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

          text = text.replace('function', "function #{fnName}") + "\nmodule.exports = #{fnName};"
          cb null, text: text, extname: '.js'
        catch ex
          return cb ex

      else
        @render asset, options, cb






