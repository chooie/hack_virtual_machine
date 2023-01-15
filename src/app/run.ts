import * as file from "@utils/file.ts";
import * as multiline from "@utils/multiline.ts";

import * as parser from "./parser.ts";
import * as codeWriter from "./code_writer.ts";

// WARNING: this file is the main run file. It is only called from the command
// line and must NOT be imported by any other module

const filePath = Deno.args[0];

if (!filePath) {
  throw new Error("You must pass a filePath");
}

if (filePath === "") {
  throw new Error("filePath must not be empty");
}

const sourceCode = await file.readTextFile(filePath);

if (file.isReadTextFileError(sourceCode)) {
  throw new Error(JSON.stringify(sourceCode, undefined, 2));
}

console.log("Reading file...");

const vmCode = convertVmCode(filePath, sourceCode);

const destinationFilePath = file.getDestinationFilePath(filePath, ".asm");
await file.writeTextFile(destinationFilePath, vmCode);

console.log(`Output to: ${destinationFilePath}`);

function convertVmCode(filePath: string, code: string) {
  const parsedCommands = parser.parse(code);
  const fileNameWithoutExtension = file.getFileNameWithoutExtension(filePath);
  const assemblyCode = parsedCommands.map((parsedCommand) => {
    return codeWriter.writeCommand(fileNameWithoutExtension, parsedCommand);
  });

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
