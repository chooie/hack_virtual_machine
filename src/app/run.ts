// import * as file from "./utilities/file.ts";

import * as multiline from "@utils/multiline.ts";

import * as parser from "./parser.ts";
import * as codeWriter from "./code_writer.ts";

// WARNING: this file is the main run file. It is only called from the command
// line and must NOT be imported by any other module

const vmCode = multiline.stripIndent`
  push constant 2
  push constant 3
  add
`;

console.log(convertVmCode(vmCode));

// const filePath = Deno.args[0];

// if (!filePath) {
//   throw new Error("You must pass a filePath");
// }

// if (filePath === "") {
//   throw new Error("filePath must not be empty");
// }

// const sourceCode = await file.readTextFile(filePath);

// if (file.isReadTextFileError(sourceCode)) {
//   throw new Error(JSON.stringify(sourceCode, undefined, 2));
// }

// console.log("Reading file");
// console.log(sourceCode);

function convertVmCode(code: string) {
  const parsedCommands = parser.parse(code);
  const assemblyCode = parsedCommands.map(codeWriter.writeCommand);

  // Every program ends with a termination loop
  assemblyCode.push(
    multiline.stripIndent`
      (END)
        @END
        0;JMP
    `,
  );
  return assemblyCode.join("\n");
}
