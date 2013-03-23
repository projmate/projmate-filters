Fs = require('fs')

{SourceMapGenerator, SourceMapConsumer, SourceNode:Node} = require("source-map")

SourceMap =

  createGenerator: (file, sourceRoot) ->
    new SourceMapGenerator({file, sourceRoot})

  loadFile: (file) ->
   content = Fs.readFileSync(file, "utf8")
   new SourceMapConsumer(content)

  rebase: (generator, map, offsetLine) ->
    consumer = new SourceMapConsumer(map)
    consumer.eachMapping (item) ->
      generator.addMapping
        source: item.source
        generated: {line: item.generatedLine + offsetLine, column: item.generatedColumn}
        original: {line: item.originalLine, column: item.originalColumn}
        name: item.name

  dump: (map, max=Number.MAX_VALUE) ->
    cons = new SourceMapConsumer(map)
    i = 0
    cons.eachMapping (item) ->
      console.log(item) if i++ < max

module.exports = SourceMap
