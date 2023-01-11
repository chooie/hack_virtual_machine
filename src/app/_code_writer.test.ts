import { assertStrictEquals } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

import * as multiline from "@utils/multiline.ts";

import * as codeWriter from "./code_writer.ts";

const test = describe("Code Writer");

describe(test, "Logical/arithmetic commands", () => {
  it("handles add", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "add",
      }),
      multiline.stripIndent`
        // add
        // pop off stack
        @SP
        // pop off stack (SP--)
        M=M-1
        A=M
        D=M
        @R13 // Store this temporarily
        M=D
        // Pop another off the stack
        @SP
        M=M-1
        A=M
        D=M
        // do add operation
        @R13
        D=D+M
        // push it back onto the stack
        @SP
        A=M
        M=D
        @SP
        M=M+1
      `,
    );
  });
});

describe(test, "Segment commands", () => {
  describe("constant", () => {
    it("push", () => {
      assertStrictEquals(
        codeWriter.writeCommand({
          command: "push",
          segment: "constant",
          value: 10,
        }),
        multiline.stripIndent`
          // push constant 10
          @10
          D=A
          @SP
          A=M
          M=D
          @SP
          M=M+1
        `,
      );
    });
  });

  // it("push pointer", () => {
  //   assertStrictEquals(
  //     codeWriter.writeCommand({
  //       command: "push",
  //       segment: "pointer",
  //       value: 0,
  //     }),
  //     multiline.stripIndent`
  //       // push pointer 0
  //       @THIS
  //       D=M
  //       @SP
  //       A=M
  //       M=D
  //       @SP
  //       M=M+1
  //     `,
  //   );

  //   assertStrictEquals(
  //     codeWriter.writeCommand({
  //       command: "push",
  //       segment: "pointer",
  //       value: 1,
  //     }),
  //     multiline.stripIndent`
  //       // push pointer 1
  //       @THAT
  //       D=M
  //       @SP
  //       A=M
  //       M=D
  //       @SP
  //       M=M+1
  //     `,
  //   );
  // });

  // it("push argument", () => {
  //   assertStrictEquals(
  //     codeWriter.writeCommand({
  //       command: "push",
  //       segment: "argument",
  //       value: 0,
  //     }),
  //     multiline.stripIndent`
  //       // push argument 0
  //       @THIS
  //       D=M
  //       @SP
  //       A=M
  //       M=D
  //       @SP
  //       M=M+1
  //     `,
  //   );
  // });
});
