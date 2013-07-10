Fs = require('fs')

{SourceMapGenerator, SourceMapConsumer, SourceNode:Node} = require("source-map")

SourceMap =

  createGenerator: (file, sourceRoot) ->
    new SourceMapGenerator({file, sourceRoot})

  loadFile: (file) ->
   content = Fs.readFileSync(file, "utf8")
   new SourceMapConsumer(content)


  # Adds source `map` mappings to generator offsetting the lines
  # by `offsetLine`.
  #
  # @param {SourceMapGenerator} generator The map aggregator.
  # @param {Object | JSON string} map The source map.
  # @param {String} source The relative source filename.
  # @param {Integer} offsetLine The offset line number.
  rebase: (generator, map, source, offsetLine) ->
    consumer = new SourceMapConsumer(map)
    consumer.eachMapping (item) ->
      generator.addMapping
        source: source
        generated: {line: item.generatedLine + offsetLine, column: item.generatedColumn}
        original: {line: item.originalLine, column: item.originalColumn}
        name: item.name

  # Dumps a source map.
  #
  # @param {Object | JSON string} map
  # @param {Integer} max The max number of lines to dump.
  dump: (map, max=Number.MAX_VALUE) ->
    cons = new SourceMapConsumer(map)
    i = 0
    cons.eachMapping (item) ->
      console.log(item) if i++ < max

module.exports = SourceMap
