/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var eventBus;

eventBus = require("../../helper").eventBus;

describe("globalTest", function() {
  global.foo = "bar";
  it("should write to file", function() {
    return eventBus.emit('mochaping', "c1");
  });
  return it("should write to file 2", function(done) {
    eventBus.emit('mochaping', "c2");
    return done();
  });
});
