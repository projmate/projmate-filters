##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Path = require('path')
_ = require('lodash')

module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  jade = require('jade')

  class JadeFilter extends Filter
    extnames: '.jade'

    process: (asset, options, cb) ->
      if options.jst
        defaults =
            client: true
            compileDebug: true
            pretty: true

        _.defaults options, defaults

        try
          text = asset.text
          fn = jade.compile(text, options)
          result = "module.exports = #{fn.toString().replace(/^function anonymous/, 'function')}"
          cb null, text: result, extname: '.js'
        catch ex
          cb ex
      else
        defaults =
          client: false
          compileDebug: true
          filename: asset.filename
          pretty: true

        _.defaults options, defaults
        try
          text = asset.text
          fn = jade.compile(text, options)
          cb null, text: fn(options), extname: '.html'
        catch ex
          cb ex


