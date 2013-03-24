{$, assert, readFileInt, Assets, Filter} = require("./helper")

mocha = Filter("../lib/mocha")

describe "Mocha", ->

  it "should run tests", (done) ->
    assets = new Assets
    assets.create filename: "#{__dirname}/res/mocha/aTest.js"
    assets.create filename: "#{__dirname}/res/mocha/aSpec.coffee"
    assets.create filename: "#{__dirname}/res/mocha/globalTest.coffee"

    task = {assets}
    mocha.process task, {globals: "foo,bar"}, (err) ->
      assert.ifError err
      filename = "#{__dirname}/res/mocha/result"
      total = readFileInt(filename)
      $.rm filename
      assert.equal total, 6
      delete global.foo
      done()


