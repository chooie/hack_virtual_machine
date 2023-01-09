import { assertStrictEquals } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

// import * as file from "./file.ts";

describe("Run smoke test", () => {
  it("can run the run.ts file", async () => {
    // await runCommand("rm -f ./src/app/test_files/Pong.hack");

    const status = await runCommand(
      "deno run --allow-read --allow-write ./src/app/run.ts ./src/app/test_files/file.txt",
    );
    assertStrictEquals(status.success, true);

    // const generatedFileContents = await file.readTextFile(
    //   "./src/app/test_files/Pong.hack",
    // );
    // const expectedFileContents = await file.readTextFile(
    //   "./src/app/test_files/Pong.hack",
    // );

    // assertStrictEquals(generatedFileContents, expectedFileContents);
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
