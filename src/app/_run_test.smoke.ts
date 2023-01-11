import { assertStrictEquals } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

import * as file from "@utils/file.ts";

describe("Run smoke test", () => {
  it("can run the run.ts file", async () => {
    const addVmFilePath = "./src/app/test_files/add.vm";
    const generatedAssemblyFilePath = "./src/app/test_files/add.asm";

    await runCommand(`rm -f ${generatedAssemblyFilePath}`);

    const status = await runCommand(`deno task start ${addVmFilePath}`);
    assertStrictEquals(status.success, true);

    const generatedFileContents = await file.readTextFile(
      generatedAssemblyFilePath,
    );
    const expectedFileContents = await file.readTextFile(
      "./src/app/test_files/add.KEEP.asm",
    );

    assertStrictEquals(generatedFileContents, expectedFileContents);
  });
});

async function runCommand(command: string): Promise<Deno.ProcessStatus> {
  const process = Deno.run({
    cmd: command.split(" "),
  });
  const status = await process.status();
  process.close();

  if (!status.success) {
    throw new Error("Command failed");
  }

  return status;
}
