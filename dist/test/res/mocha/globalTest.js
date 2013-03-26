/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var addFileInt;

addFileInt = require("../../helper").addFileInt;

describe("globalTest", function() {
  global.foo = "bar";
  it("should write to file", function() {
    return addFileInt(__dirname + "/result", 1);
  });
  return it("should write to file 2", function(done) {
    addFileInt(__dirname + "/result", 1);
    return done();
  });
});


/*
//@ sourceMappingURL=globalTest.map
*/