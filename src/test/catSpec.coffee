{assert, Assets, Filter} = require("./helper")

cat = Filter("../lib/cat")

describe "Cat", ->

  it "should handle concat", (done) ->
    assets = new Assets
    assets.create filename: "notused.ext", text:"b"
    assets.create filename: "notused.ext", text:"x"
    assets.create filename: "notused.ext", text:"c"
    assets.create filename: "notused.ext", text:"d"

    task = {assets}

    cat.process task, {filename: "foo.ext"}, (err, result) ->
      assert.equal assets.size(), 1
      # assert.equal result.text, "bxcd"
      # assert.equal result.filename, "foo.ext"
      assert.equal assets.at(0).filename, "foo.ext"
      assert.equal assets.at(0).text, "bxcd"
      done()


