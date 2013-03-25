"use strict";

module.exports = function(Projmate) {
  require('coffee-script');
  var MochaClass = require('mocha');

  function Mocha() {
    this.extnames = ['.js', '.coffee'];
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsTaskProcessor(Mocha)

  Mocha.prototype.process = function(task, options, cb) {
    var mocha = new MochaClass(options);
    task.assets.each(function(asset) {
      mocha.addFile(asset.filename);
    })
    mocha.run(cb);
  }

  /**
   * This processor loads files on its own.
   */
  Mocha.__pragma = { disableLoadFiles: true };

  /**
   * For UI.
   */
  Mocha.options = {
    globals: {
      desc: "Allow these global variables",
      type: "[String]"
    },
    reporter: {
      desc: "The reporter to use",
      type: "String",
      enums: "reporter",
      example: "spec"
    }
  };

  return Mocha;
}
