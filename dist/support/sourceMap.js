/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Fs, Node, SourceMap, SourceMapConsumer, SourceMapGenerator, _ref;

Fs = require('fs');

_ref = require("source-map"), SourceMapGenerator = _ref.SourceMapGenerator, SourceMapConsumer = _ref.SourceMapConsumer, Node = _ref.SourceNode;

SourceMap = {
  createGenerator: function(file, sourceRoot) {
    return new SourceMapGenerator({
      file: file,
      sourceRoot: sourceRoot
    });
  },
  loadFile: function(file) {
    var content;
    content = Fs.readFileSync(file, "utf8");
    return new SourceMapConsumer(content);
  },
  rebase: function(generator, map, source, offsetLine) {
    var consumer;
    consumer = new SourceMapConsumer(map);
    return consumer.eachMapping(function(item) {
      return generator.addMapping({
        source: source,
        generated: {
          line: item.generatedLine + offsetLine,
          column: item.generatedColumn
        },
        original: {
          line: item.originalLine,
          column: item.originalColumn
        },
        name: item.name
      });
    });
  },
  dump: function(map, max) {
    var cons, i;
    if (max == null) {
      max = Number.MAX_VALUE;
    }
    cons = new SourceMapConsumer(map);
    i = 0;
    return cons.eachMapping(function(item) {
      if (i++ < max) {
        return console.log(item);
      }
    });
  }
};

module.exports = SourceMap;
