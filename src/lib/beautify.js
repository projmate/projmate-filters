/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var _ = require('lodash');

module.exports = function(Projmate) {

  /**
   * Beautifies web assets.
   */
  function Beautify() {
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(Beautify);


  Beautify.schema = {
    title: 'Beautifies CSs, HTML or JavaScript',
    type: 'object',
    properties: {
      indent_size: {
        description: 'Number of spaces to indent',
        type: 'integer',
        default: 2
      },
      indent_char: {
        description: 'Character to indent with',
        type: 'string',
        default: ' '
      },
      max_preserve_newlines: {
        description: 'Maximum number of lines breaks to preserve',
        type: 'integer'
      }
    },

    __: {
      extnames: ['.css', '.html', '.js'],
    },
  };

  /**
   * Beautifies based on extension.
   *
   * @param {Object} options = {
   * }
   *
   * @example
   *
   *  To beautify js
   *
   *    f.beautify(indent_size: 2, brace_style: 'collapse'
   */
  Beautify.prototype.process = function(asset, options, cb) {
    var extname = asset.extname;

    try {
      var beautify, options;
      if (extname === '.js') {
        beautify = require('../support/js-beautify/beautify').js_beautify;
      } else if (extname === '.css') {
        beautify = require('../support/js-beautify/beautify-css').css_beautify;
      } else if (extname === '.html') {
        beautify = require('../support/js-beautify/beautify-html').html_beautify;
      }
      options = _.defaults(options, {
        indent_size: 2
      });
      var result = beautify(asset.text, options);
      cb(null, result);
    } catch (ex) {
      return cb(ex);
    }
  };
  return Beautify;
};
