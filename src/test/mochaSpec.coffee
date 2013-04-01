{$, assert, readFileInt, Assets, Filter, eventBus} = require("./helper")

mocha = Filter("../lib/mocha")
Fs = require('fs')

describe "Mocha", ->

  it "should run tests", (done) ->
    assets = new Assets
    assets.create filename: "#{__dirname}/res/mocha/aSpec.coffee"
    assets.create filename: "#{__dirname}/res/mocha/bTest.js"
    # TODO fix global leaks
    #assets.create filename: "#{__dirname}/res/mocha/cGlobalTest.coffee"

    output = []
    eventBus.on 'mochaping', (val) ->
      output.push val

    task = {assets}
    mocha.process task, {globals: ['foo']}, (err) ->
      assert.ifError err
      assert.equal output.length, 4
      assert.isTrue output.indexOf('a1') > -1
      assert.isTrue output.indexOf('b2') > -1
      delete global.foo
      done()

