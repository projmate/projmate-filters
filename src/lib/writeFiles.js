/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Path = require("path");
var Fs = require("path");

module.exports = function(Projmate) {

  /**
   * Writes all assets to file system.
   *
   * @note This is a good example of how to write a filter in JavaScript
   * and remain compatiblewith CoffeeScript class.
   */
  function WriteFile() {
    this.extnames = "*";
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(WriteFile);


  WriteFile.prototype.process = function(asset, options, cb) {
    var filename = asset.filename;
    // TODO issues with reduced filesets, fix later
    options.force = true;
    if (options.force || asset.newerThan(filename)) {
      asset.write(filename, cb);
    } else {
      this.log.info("Skipping up-to-date " + filename);
      cb();
    }
  };

  return WriteFile;
};
