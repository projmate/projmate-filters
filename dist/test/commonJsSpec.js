var assert, exec;

exec = require('child_process').exec;

assert = require('assert');

describe('CommonJs', function() {
  it('should create package', function(done) {
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
  return it('should create package 2', function(done) {
    return exec('pm run testCommonJs2', {
      cwd: __dirname
    }, function() {
      return exec('node tmp/apackage2.js', {
        cwd: __dirname
      }, function(err, stdout) {
        assert.equal(stdout, 'STANDALONE\nhello world!\n');
        return done();
      });
    });
  });
});


/*
//@ sourceMappingURL=commonJsSpec.map
*/