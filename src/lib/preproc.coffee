##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

pp  = require("../support/preprocess")
_ = require ("lodash")

module.exports = (Projmate) ->
  escJs = (s) -> s.replace(/\\/g, '\\\\')

  schema =
    title: 'Preprocesses assets given definitions in options'
    type: 'object'

    __:
      extnames: "*"

  # Preprocess the `asset` given definition in `options`.
  class PreProcessor extends Projmate.Filter
    @schema: schema

    process: (asset, options, cb) ->
      root = options.root || asset.dirname
      _.defaults options, root: root, escJs: escJs
      try
        result = pp(asset.text, options)
        cb null, result.join("\n")
      catch ex
        cb ex
