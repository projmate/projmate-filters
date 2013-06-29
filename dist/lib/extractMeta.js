/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */


var _ = require('lodash');

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
   * Extracts meta from a string or uses an object.
   *
   * @param {Object} options = {
   *  {Object} from The source. If undefined then the `asset.text` is used.
   *  {String} as The name `options` property to assign.
   * }
   *
   * If options.as is not defined then meta is merged into `options`
   * argument for each filter's `process` in the pipeline.
   *
   * If options.as is defined then it becomes the name of of the property
   * in `options`. For example extractMeta as: 'foo'
   */
  ExtractMeta.prototype.process = function(asset, options, cb) {
    options.from || (options.from = asset.text);
    var text = asset.text;
    var mode = options.as;
    var from = options.from;
    var meta, result;

    try {
      if (_.isString(from)) {
        result = extractFromString(from);
        if (result.err) return cb(result.err);
        meta = result.meta;
        text = result.text;
        asset.text = text;
      } else if (_.isObject(from)) {
        meta = from;
      } else {
        return cb('`options.from` is must be a string or function');
      }

      if (options.as) {
        asset.__meta = { name: options.as, meta: meta };
      } else {
        // task's pipeline looks for this hidden property
        asset.__filterOptions = meta;
      }
      cb();
    } catch (ex) {
      return cb(ex);
    }
  };
  return ExtractMeta;
};
