/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var assert, exec;

exec = require('child_process').exec;

assert = require('assert');

describe('CommonJs', function() {
  return it('should work', function(done) {
    return exec('pm run testCommonJs', {
      cwd: __dirname
    }, function() {
      return exec('node tmp/apackage.js', {
        cwd: __dirname
      }, function(err, stdout) {
        assert.equal(stdout, 'STANDALONE\nhello world!\n');
        return done();
      });
    });
  });
});