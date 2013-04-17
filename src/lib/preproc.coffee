##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

pp  = require("../support/preprocess")
_ = require ("lodash")

module.exports = (Projmate) ->
  escJs = (s) -> s.replace(/\\/g, '\\\\')

  # Preprocess the `asset` given definition in `options`.
  #
  class PreProcessor extends Projmate.Filter
    extnames: "*"



    process: (asset, options, cb) ->
      _.defaults options, root: asset.dirname, escJs: escJs
      try
        result = pp(asset.text, options)
        cb null, result.join("\n")
      catch ex
        cb ex
