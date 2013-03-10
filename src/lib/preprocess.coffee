# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#
pp  = require("../support/preprocess")
_ = require ("lodash")

module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  # Preprocess the `asset` given definition in `options`.
  #
  class PreProcess extends Filter
    extnames: "*"

    process: (asset, options, cb) ->
      try
        result = pp(asset.text, options)
        cb null, result.join("\n")
      catch ex
        cb ex
