import { assertStrictEquals } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

import * as multiline from "@utils/multiline.ts";

import * as codeWriter from "./code_writer.ts";

const test = describe("Code Writer");

describe(test, "Logical/arithmetic commands", () => {
  it("add", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "add",
      }),
      multiline.stripIndent`
        // add
        @SP
        AM=M-1
        D=M
        A=A-1
        M=D+M
      `,
    );
  });

  it("sub", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "sub",
      }),
      multiline.stripIndent`
        // sub
        @SP
        AM=M-1
        D=M
        A=A-1
        M=M-D
      `,
    );
  });

  it("neg", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "neg",
      }),
      multiline.stripIndent`
        // neg
        @SP
        A=M-1
        M=-M
      `,
    );
  });

  it("eq", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "eq",
      }),
      multiline.stripIndent`
        // eq
        @SP
        AM=M-1
        D=M
        A=A-1
        D=M-D
        @CASE_EQUAL_0
        D;JEQ
        @SP
        A=M-1
        M=0
        @END_CASE_HANDLING_1
        0;JMP
        (CASE_EQUAL_0)
        @SP
        A=M-1
        M=1
        (END_CASE_HANDLING_1)
      `,
    );
  });

  it("gt", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "gt",
      }),
      multiline.stripIndent`
        // gt
        @SP
        AM=M-1
        D=M
        A=A-1
        D=M-D
        @CASE_GREATER_THAN_2
        D;JGT
        @SP
        A=M-1
        M=0
        @END_CASE_HANDLING_3
        0;JMP
        (CASE_GREATER_THAN_2)
        @SP
        A=M-1
        M=1
        (END_CASE_HANDLING_3)
      `,
    );
  });
});

describe(test, "Segment commands", () => {
  describe("constant", () => {
    // TODO: handle negative numbers

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
