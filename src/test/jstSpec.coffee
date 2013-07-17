{assert, textAsset, Filter} = require("./helper")

template = Filter("../lib/jst")

describe "jst", ->

  it "compile a template and default to 'it' as only argument", (done) ->
    asset = textAsset("""
      <html>
      <% var code = 0; %>
      <%= it.name %>
      <%- '<raw>' %>
      </html>
      """)

    template.process asset, {jst: true}, (err, result) ->
      assert.ifError err
      text = result.text
      assert.isTrue text.indexOf('<%') < 0
      assert.isTrue text.indexOf('(it)') > 0
      assert.ok text.match(/\bit\.name/)
      assert.isTrue text.indexOf('module.exports') > 0
      assert.equal result.extname, '.js'
      done()

  it "should compile with a function header", (done) ->
    asset = textAsset("""
      <!--function(user)-->
      <html>
      <% var code = 0; %>
      <%= user.name %>
      <%- '<raw>' %>
      </html>
      """)

    template.process asset, {jst: true}, (err, result) ->
      assert.ifError err
      text = result.text
      assert.isTrue text.indexOf('<%') < 0
      assert.isTrue text.indexOf('(user)') > 0
      assert.ok text.match(/\buser\.name/)
      assert.isTrue text.indexOf('module.exports') > 0
      assert.equal result.extname, '.js'
      done()


  it "should compile  simple text", (done) ->
    asset = textAsset('Hello <%= name %>')

    template.process asset, {jst: false, name: 'foo'}, (err, result) ->
      assert.ifError err
      assert.equal result.text, 'Hello foo'
      assert.equal result.extname, '.html'
      done()
