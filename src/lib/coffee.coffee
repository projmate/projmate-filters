##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

coffee  = require("coffee-script")
_ = require ("lodash")
{defer} = require("when")
Path = require("path")

# Repeat a string `n` times.
exports.repeat = repeat = (str, n) ->
  # Use clever algorithm to have O(log(n)) string concatenation operations.
  res = ''
  while n > 0
    res += str if n & 1
    n >>>= 1
    str += str
  res

prettyErrorMessage = (error, fileName, code) ->
  return error.stack or "#{error}" unless error.location

  {first_line, first_column, last_line, last_column} = error.location
  codeLine = code.split('\n')[first_line]
  start    = first_column
  # Show only the first line on multi-line errors.
  end      = if first_line is last_line then last_column + 1 else codeLine.length
  marker   = repeat(' ', start) + repeat('^', end - start)

  message = """
  \n
  #{fileName}:#{first_line + 1}:#{first_column + 1}: error: #{error.message}
  #{codeLine}
  #{marker}
  """


module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  # Compiles CoffeeScript to JavaScript.
  #
  class Coffee extends Filter
    extnames: [".coffee", ".litcoffee", ".coffee.md"]
    outExtname: ".js"
    defaults:
      # source maps are a good thing in development but not yet fully tested
      development: {sourceMap: false}
      production: {sourceMap: false}

    process: (asset, options, cb) ->
      if options.sourceMap
        options.filename = asset.filename
        # the coffee file in sourcemap
        options.sourceFiles = [asset.basename]
        # the generate js file
        options.generatedFile = Utils.changeExtname(asset.basename, ".js")

      try
        result = coffee.compile(asset.text, options)
        if result.v3SourceMap
          js = result.js
          sourceMap = result.v3SourceMap

          # supposedly fix for IE, kill it already
          # Add sourcemap line
          js += """
          \n
          /*
          //@ sourceMappingURL=#{Utils.changeExtname(asset.basename, '.map')}
          */
          """

          # js += """
          #   \n
          #   //@ sourceMappingURL=#{Utils.changeExtname(asset.basename, '.map')}
          #   """

          # add new asset for map
          mapAsset = asset.parent.create(filename: Utils.changeExtname(asset.filename, ".map"), text: sourceMap)

          # The filename for source mapping is unknown until the time of writing. Replace it with
          # relative path.
          mapAsset.whenWriting ->
            relPath = Path.relative(Path.dirname(asset.filename), asset.originalFilename)
            mapAsset.text = mapAsset.text.replace(Path.basename(asset.originalFilename), relPath)

        else
          js = result

        cb null, js
      catch err
        cb prettyErrorMessage(err, asset.filename, asset.text)

