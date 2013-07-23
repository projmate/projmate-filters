exec = require('child_process').exec
assert = require('assert')

describe 'CommonJs', ->
  it 'should create package', (done) ->
    exec 'pm run testCommonJs',  cwd: __dirname, ->
      exec 'node tmp/apackage.js',  cwd: __dirname, (err, stdout) ->
        assert.equal stdout, 'STANDALONE\nhello world!\n'
        done()

  it 'should create package 2', (done) ->
    exec 'pm run testCommonJs2',  cwd: __dirname, ->
      exec 'node tmp/apackage2.js',  cwd: __dirname, (err, stdout) ->
        assert.equal stdout, 'STANDALONE\nhello world!\n'
        done()


