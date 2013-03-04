Compiler = require('./compiler')
fs       = require('fs')
path     = require('path')
stylus   = require('stylus')

try
  nib = require('nib')()
catch error
  false

class StylusCompiler extends Compiler
  extnames: '.styl'
  outExtname: '.css'

  compile: (info, cb) ->
    options = @options
    {text, pathname} = info
    try
      compiler = stylus(text)
        .set('filename', pathname)
        .set('compress', true)
        .include(path.dirname(pathname))

      if nib
        compiler.include nib.path

      compiler.render cb
    catch err
      cb err

module.exports = StylusCompiler
