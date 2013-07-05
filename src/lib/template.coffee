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

schema =
  title: 'Filters an asset through a template.'
  type: 'object'
  properties:
    delimiters:
      type: 'enum'
      description: 'The delimiters used in template. ejs | php | mustache'
    filename:
      type: 'string'
      description: 'Path to template file'
    text:
      type: 'string'
      description: 'String template'

  __:
    extnames: ['*']
    outExtname: ".html"
    examples: [
      title: 'Use a mustache file'
      text:
        """
        f.template({delimiters: 'mustache', filename: 'src/docs/_layout.mustache'})
        """
    ,
      title: 'Use a string template'
      text:
        """
        f.template({text: 'Your asset: <%= asset.text %>'})
        """
    ]


module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  class Template extends Projmate.Filter
    @schema: schema

    render: (asset, options, cb) ->
      options.asset = asset
      #options.variable = options.paramName || 'it'
      if options.delimiters and delimiters[options.delimiters]
        templateDelimiters = delimiters[options.delimiters]
      else
        templateDelimiters = delimiters.ejs

      # legacy name
      if options.layout
        options.filename = options.layout

      if options.filename
        @cache ?= {}
        if @cache[options.filename]
          text = @cache[options.filename]
        else
          text = Fs.readFileSync(options.filename, 'utf8')
          @cache[options.filename] = text
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

