##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

module.exports = (Projmate) ->

  # Facilitates creating ad-hoc filters.
  #
  # @example
  #
  # replaceVersion = f.functoid process: (asset, options) ->
  #   asset.text = asset.text.replace /VERSION/g, "1.0.1"
  class Functoid extends Projmate.Filter
    extnames: "*"

    process: (asset, options, cb) ->
      fn = options.process

      return cb("Options.process is required and must be a function(asset, options[, cb])") unless typeof fn == "function"

      if fn.length == 2
        try
          result = fn(asset, options)
          cb null, result
        catch ex
          cb ex
      else
        fn asset, options, cb


