exec = require('child_process').exec
assert = require('assert')

describe 'CommonJs', ->
  it 'should work', (done) ->
    exec 'pm run testCommonJs',  cwd: __dirname, ->
      exec 'node tmp/apackage.js',  cwd: __dirname, (err, stdout) ->
        assert.equal stdout, 'STANDALONE\nhello world!\n'
        done()


