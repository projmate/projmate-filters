/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

function parseCSON(source) {
  // TODO run in sandbox
  var CoffeeScript = require('coffee-script');
  var js = CoffeeScript.compile(source, {bare: true});
  source = js.replace('(', 'return (');
  var fn = new Function(source);
  return fn();
}


/**
 * Extracts meta from a text file and assets it to `asset.meta`.
 *
 * @returns {
 *  {String} meta The metadata found.
 *  {String} text The text without the meta.
 *  or
 *  {String} err The error object or description.
 * }
 *
 *
 *
 * @example
 * Meta must be assignalbe to CoffeeScript variable.
 * ---
 * foo: 'FOO'
 * bar: 'BAR'
 *   baz: ['bah', 'asdf']
 * ---
 */
function extractFromString(text) {
  var re = /^---[\r\n]((.|[\r\n])*?)^---[\r\n]((.|[\r\n])*)/m;
  var meta, text;

  if (text.indexOf('---') === 0) {
    var matches = text.match(re);
    if (matches) {
      try {
        return {
          meta: parseCSON(matches[1]),
          text: matches[3] ? matches[3] : ''
        };
      } catch (err) {
        return { err: err };
      }
    }
  }

  return { meta: null, text: text };
}


function extractFromModule(filename) {
  var mod = require(filename);
  return typeof mod === 'function' ? mod() : mod;
}


module.exports = function(Projmate) {

  /**
   * Extracts meta from a text file and assets it to `asset.meta`.
   *
   * @example
   * Meta must be assignalbe to CoffeeScript variable.
   * ---
   * foo: 'FOO'
   * bar: 'BAR'
   *   baz: ['bah', 'asdf']
   * ---
   */
  function ExtractMeta() {
    this.extnames = '*';
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(ExtractMeta);


  /**
   * Extracts meta.
   *
   * @param {Object} options = {
   *  {String} as: 'merge' | 'property'
   * }
   *
   * If options.as is 'merge' then meta is merged into each
   * filter's options argument. This is the default.
   *
   * If options.as is 'property' then asset._meta = meta.
   */
  ExtractMeta.prototype.process = function(asset, options, cb) {
    var text = asset.text;
    var mode = options.as ? options.as : 'merge';
    var from = options.from ? options.from : 'asset';
    var meta, result;

    try {
      if (from === 'asset') {
        result = extractFromString(text);
        if (result.err) return cb(result.err);
        meta = result.meta;
        text = result.text;
      } else if (typeof from === 'string') {
        meta = require(from);
      } else if (typeof from === 'object') {
        meta = from;
      }

      asset.text = text;
      if (mode === 'property') {
        asset._meta = meta;
      } else {
        // task's pipeline looks for this hidden property
        asset.__merge = meta;
      }
      cb();
    } catch (ex) {
      return cb(ex);
    }
  };
  return ExtractMeta;
};
