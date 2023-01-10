import { assertEquals, assertThrows } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

import * as parser from "./parser.ts";

/*
BasicTest.vm

push constant 10
pop local 0
push constant 21
push constant 22
pop argument 2
pop argument 1
push constant 36
pop this 6
push constant 42
push constant 45
pop that 5
pop that 2
push constant 510
pop temp 6
push local 0
push that 5
add
push argument 1
sub
push this 6
push this 6
add
sub
push temp 6
add
*/

describe("Parser", () => {
  it("parses pushes", () => {
    assertEquals(parser.parse("push constant 10"), {
      command: "push",
      segment: "constant",
      value: 10,
    });

    assertEquals(parser.parse("push local 0"), {
      command: "push",
      segment: "local",
      value: 0,
    });
  });

  it("parses pops", () => {
    assertEquals(parser.parse("pop local 0"), {
      command: "pop",
      segment: "local",
      value: 0,
    });

    assertEquals(parser.parse("pop argument 2"), {
      command: "pop",
      segment: "argument",
      value: 2,
    });
  });

  it("parses arithmetic/logical commands", () => {
    assertEquals(parser.parse("add"), {
      command: "add",
    });

    assertEquals(parser.parse("sub"), {
      command: "sub",
    });
  });

  it("fails on bad commands", () => {
    assertThrows(
      () => {
        parser.parse("foo");
      },
      Error,
      "Command not implemented, 'foo'",
    );
  });
});
