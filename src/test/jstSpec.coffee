{assert, textAsset, Filter} = require("./helper")

template = Filter("../lib/jst")

describe "template", ->

  it "compile a template and default to 'it' as only argument", (done) ->
    asset = textAsset("""
      <html>
      <% var code = 0; %>
      <%= it.name %>
      <%- '<raw>' %>
      </html>
      """)

    template.process asset, {jst: true}, (err) ->
      assert.ifError err
      assert.isTrue asset.text.indexOf('<%') < 0
      assert.isTrue asset.text.indexOf('(it)') > 0
      assert.ok asset.text.match(/\bit\.name/)
      assert.isTrue asset.text.indexOf('module.exports') > 0
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

    template.process asset, {jst: true}, (err) ->
      assert.ifError err
      assert.isTrue asset.text.indexOf('<%') < 0
      assert.isTrue asset.text.indexOf('(user)') > 0
      assert.ok asset.text.match(/\buser\.name/)
      assert.isTrue asset.text.indexOf('module.exports') > 0
      done()

