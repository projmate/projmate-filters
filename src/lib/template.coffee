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
  title: 'Filters asset(s) through a template.'
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

    process: (asset, options, cb) ->
      if not (options.text or options.filename)
        return cb('options.text or options.filename is required')

      options.asset = asset
      if options.delimiters and delimiters[options.delimiters]
        templateDelimiters = delimiters[options.delimiters]
      else
        templateDelimiters = delimiters.ejs

      if options.filename
        @cache ?= {}
        if @cache[options.filename]
          text = @cache[options.filename]
        else
          text = Fs.readFileSync(options.filename, 'utf8')
          @cache[options.filename] = text
      else
        text = options.text

      try
        _.extend _.templateSettings, templateDelimiters
        result = _.template(text, options)
        cb null, result
      catch ex
        return cb ex

