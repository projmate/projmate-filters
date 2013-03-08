# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#

Fs = require("fs")

module.exports = (Projmate) ->

  # Adds a header to an asset.
  #
  class AddHeader extends Projmate.Filter
    extnames: "*"

    constructor: ->
      @cache = {}
      super

    process: (asset, options, cb) ->
      {text, filename} = options

      # Add header if does not already exist.
      returnResult = (header) ->
        if asset.text.indexOf(header) < 0
          cb null, header + asset.text
        else
          cb()

      if text
        returnResult text
      else if filename
        cache = @cache
        header = cache[filename]
        if header
          returnResult header
        else
          Fs.readFile filename, 'utf8', (err, header) ->
            return cb(err) if err
            #header = header.replace(/\r/g, "")
            cache[filename] = header
            returnResult header
      else
        @log.warn "Nothing to add, `options.text` or `options.filename` was empty"
        cb()


