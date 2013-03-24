{addFileInt} = require("../../helper")

describe "bTest", ->
  global.foo = "bar"
  it "should write to file", ->
    addFileInt __dirname+"/result", 1
  it "should write to file 2", (done) ->
    addFileInt __dirname+"/result", 1
    done()
