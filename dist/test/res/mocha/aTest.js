/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var addFileInt = require("../../helper").addFileInt;

describe("aTest", function() {
  it("should write to file", function() {
    addFileInt(__dirname+"/result", 1);
  });
  it("should write to file 2", function(done) {
    addFileInt(__dirname+"/result", 1);
    done();
  });
});
