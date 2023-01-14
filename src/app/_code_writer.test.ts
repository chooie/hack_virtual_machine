import { assertStrictEquals, assertThrows } from "@test_deps/assert.ts";
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
    // TRUE is represented as -1
    // FALSE is represented as 0
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
        M=-1
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
        M=-1
        (END_CASE_HANDLING_3)
      `,
    );
  });

  it("lt", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "lt",
      }),
      multiline.stripIndent`
        // lt
        @SP
        AM=M-1
        D=M
        A=A-1
        D=M-D
        @CASE_LESS_THAN_4
        D;JLT
        @SP
        A=M-1
        M=0
        @END_CASE_HANDLING_5
        0;JMP
        (CASE_LESS_THAN_4)
        @SP
        A=M-1
        M=-1
        (END_CASE_HANDLING_5)
      `,
    );
  });

  it("and", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "and",
      }),
      multiline.stripIndent`
        // and
        @SP
        AM=M-1
        D=M
        A=A-1
        M=D&M
      `,
    );
  });

  it("or", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "or",
      }),
      multiline.stripIndent`
        // or
        @SP
        AM=M-1
        D=M
        A=A-1
        M=D|M
      `,
    );
  });

  it("not", () => {
    assertStrictEquals(
      codeWriter.writeCommand({
        command: "not",
      }),
      multiline.stripIndent`
        // not
        @SP
        A=M-1
        M=!M
      `,
    );
  });
});

describe(test, "Segment commands", () => {
  describe("constant", () => {
    // REMINDER: the VM translator does not support negative numbers like
    //           `push constant -10`
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
          M=M+1
          A=M-1
          M=D
        `,
      );
    });
  });

  describe("local", () => {
    it("push", () => {
      assertStrictEquals(
        codeWriter.writeCommand({
          command: "push",
          segment: "local",
          value: 10,
        }),
        [
          "// push local 10",
          // Get LCL + 10
          "@10",
          "D=A",
          "@LCL",
          "D=D+M",
          // D <- RAM[LCL + 10]
          "A=D",
          "D=M",
          // Increment the stack and go to that address
          "@SP",
          "AM=M+1",
          "M=D",
        ].join("\n"),
      );
    });

    it("pop", () => {
      assertStrictEquals(
        codeWriter.writeCommand({
          command: "pop",
          segment: "local",
          value: 10,
        }),
        [
          "// pop local 10",
          // Get LCL + 10
          "@10",
          "D=A",
          "@LCL",
          "D=D+M",
          // Store address in R13
          "@R13",
          "M=D",
          // Decrement stack pointer and go to address
          "@SP",
          "AM=M-1",
          // Get value from stack
          "D=M",
          // Get address from R13 and set it to stack value
          "@R13",
          "A=M",
          "M=D",
        ].join("\n"),
      );
    });

    describe("argument", () => {
      it("push", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "push",
            segment: "argument",
            value: 10,
          }),
          [
            "// push argument 10",
            // Get ARG + 10
            "@10",
            "D=A",
            "@ARG",
            "D=D+M",
            // D <- RAM[ARG + 10]
            "A=D",
            "D=M",
            // Increment the stack and go to that address
            "@SP",
            "AM=M+1",
            "M=D",
          ].join("\n"),
        );
      });

      it("pop", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "pop",
            segment: "argument",
            value: 10,
          }),
          [
            "// pop argument 10",
            // Get ARG + 10
            "@10",
            "D=A",
            "@ARG",
            "D=D+M",
            // Store address in R13
            "@R13",
            "M=D",
            // Decrement stack pointer and go to address
            "@SP",
            "AM=M-1",
            // Get value from stack
            "D=M",
            // Get address from R13 and set it to stack value
            "@R13",
            "A=M",
            "M=D",
          ].join("\n"),
        );
      });
    });

    describe("this", () => {
      it("push", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "push",
            segment: "this",
            value: 10,
          }),
          [
            "// push this 10",
            // Get THIS + 10
            "@10",
            "D=A",
            "@THIS",
            "D=D+M",
            // D <- RAM[THIS + 10]
            "A=D",
            "D=M",
            // Increment the stack and go to that address
            "@SP",
            "AM=M+1",
            "M=D",
          ].join("\n"),
        );
      });

      it("pop", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "pop",
            segment: "this",
            value: 10,
          }),
          [
            "// pop this 10",
            // Get THIS + 10
            "@10",
            "D=A",
            "@THIS",
            "D=D+M",
            // Store address in R13
            "@R13",
            "M=D",
            // Decrement stack pointer and go to address
            "@SP",
            "AM=M-1",
            // Get value from stack
            "D=M",
            // Get address from R13 and set it to stack value
            "@R13",
            "A=M",
            "M=D",
          ].join("\n"),
        );
      });
    });

    describe("that", () => {
      it("push", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "push",
            segment: "that",
            value: 10,
          }),
          [
            "// push that 10",
            // Get THAT + 10
            "@10",
            "D=A",
            "@THAT",
            "D=D+M",
            // D <- RAM[THAT + 10]
            "A=D",
            "D=M",
            // Increment the stack and go to that address
            "@SP",
            "AM=M+1",
            "M=D",
          ].join("\n"),
        );
      });

      it("pop", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "pop",
            segment: "that",
            value: 10,
          }),
          [
            "// pop that 10",
            // Get THAT + 10
            "@10",
            "D=A",
            "@THAT",
            "D=D+M",
            // Store address in R13
            "@R13",
            "M=D",
            // Decrement stack pointer and go to address
            "@SP",
            "AM=M-1",
            // Get value from stack
            "D=M",
            // Get address from R13 and set it to stack value
            "@R13",
            "A=M",
            "M=D",
          ].join("\n"),
        );
      });
    });

    describe("pointer", () => {
      it("push THIS", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "push",
            segment: "pointer",
            value: 0,
          }),
          [
            "// push pointer 0",
            "@THIS",
            "D=M",
            "@SP",
            "M=M+1",
            "A=M-1",
            "M=D",
          ].join("\n"),
        );
      });

      it("push THAT", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "push",
            segment: "pointer",
            value: 1,
          }),
          [
            "// push pointer 1",
            "@THAT",
            "D=M",
            "@SP",
            "M=M+1",
            "A=M-1",
            "M=D",
          ].join("\n"),
        );
      });

      it("pop THIS", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "pop",
            segment: "pointer",
            value: 0,
          }),
          // deno-fmt-ignore
          // prettier-ignore
          [
            "// pop pointer 0",
            "@SP",
            "AM=M-1",
            "D=M",
            "@THIS",
            "M=D",
          ].join("\n"),
        );
      });

      it("pop THAT", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "pop",
            segment: "pointer",
            value: 1,
          }),
          // deno-fmt-ignore
          // prettier-ignore
          [
            "// pop pointer 1",
            "@SP",
            "AM=M-1",
            "D=M",
            "@THAT",
            "M=D",
          ].join("\n"),
        );
      });

      it("Fails when a pointer index other than 0 or 1 is used", () => {
        assertThrows(
          () => {
            codeWriter.writeCommand({
              command: "pop",
              segment: "pointer",
              value: 2,
            });
          },
          Error,
          "Value must equal 0 or 1",
        );
      });
    });

    describe("temp", () => {
      it("push", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "push",
            segment: "temp",
            value: 1,
          }),
          [
            "// push temp 1",
            // Get TEMP + 1
            "@1",
            "D=A",
            "@TEMP",
            "D=D+M",
            // D <- RAM[TEMP + 1]
            "A=D",
            "D=M",
            // Increment the stack and go to that address
            "@SP",
            "AM=M+1",
            "M=D",
          ].join("\n"),
        );
      });

      it("pop", () => {
        assertStrictEquals(
          codeWriter.writeCommand({
            command: "pop",
            segment: "temp",
            value: 1,
          }),
          [
            "// pop temp 1",
            // Get TEMP + 1
            "@1",
            "D=A",
            "@TEMP",
            "D=D+M",
            // Store address in R13
            "@R13",
            "M=D",
            // Decrement stack pointer and go to address
            "@SP",
            "AM=M-1",
            // Get value from stack
            "D=M",
            // Get address from R13 and set it to stack value
            "@R13",
            "A=M",
            "M=D",
          ].join("\n"),
        );
      });

      it("fails on indexes greater than 7", () => {
        assertThrows(
          () => {
            codeWriter.writeCommand({
              command: "pop",
              segment: "temp",
              value: 8,
            });
          },
          Error,
          "Used a value greater than 7",
        );
      });
    });
  });
});
