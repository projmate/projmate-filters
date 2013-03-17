/*
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

module.exports = function(Projmate) {

  /**
   * Detabifies an asset.
   */
  function Detab() {
    this.extnames = '*';
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(Detab);

  /**
   * Detabs an asset.
   *
   * @param {Object} options = {
   *  {String} tabSize Tab size.
   * }
   */
  Detab.prototype.process = function(asset, options, cb) {
    const SPACES = "        ";
    var tabSize = options.tabSize || 8;
    var lines = asset.text.split("\t");
    var spaced = "";
    for (var i = 0, L = lines.length; i < L; i++) {
      spaced += lines[i] + SPACES(0, tabSize - lines[i].length % tabSize);
    }
    cb(null, spaced);
  };

  return Detab;
};
