/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

"use strict";

module.exports = function(Projmate) {
  require('coffee-script');
  var MochaClass = require('mocha');

  function Mocha() {
    this.extnames = ['.js', '.coffee'];
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


  /**
   * For UI.
   */
  Mocha.meta = {
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
