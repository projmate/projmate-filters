"use strict";

module.exports = function(Projmate) {
  require('coffee-script');
  var MochaClass = require('mocha');

  function Mocha() {
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsTaskProcessor(Mocha);

  Mocha.prototype.process = function(task, options, cb) {
    var mocha = new MochaClass(options);
    task.assets.each(function(asset) {
      mocha.addFile(asset.filename);
    });
    mocha.run(function(result) {
      if (result === 0) result = null;
      cb(result);
    });
  };

  Mocha.schema = {
    title: 'Runs mocha tests (CoffeeScript aware)',
    type: 'object',
    properties: {
      globals: {
        description: "Allowed global variables",
        type: "string"
      },
      reporter: {
        description: "The reporter to use",
        type: 'string'
      },
      ui: {
        decription: 'The type of tests',
        type: 'string'
      }
    },

    __: {
      extnames: ['.js', '.coffee'],
      useLoader: 'stat',
      note: "Run `mocha --help` from terminal to see other options"
    }
  };

  return Mocha;
}
