import { assertEquals, assertStrictEquals } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

import { APP_ROOT } from "@/constants.ts";

import * as file from "./file.ts";

const filePath = `${APP_ROOT}/test_files`;

describe("Files", () => {
  it("makes a destination file path", () => {
    const relativePath = "./src/app/test_files/some_file";
    const fileEnding = ".new_file_ending";
    const actual = file.getDestinationFilePath(
      `${relativePath}.txt`,
      fileEnding,
    );
    const expected = `${relativePath}${fileEnding}`;
    assertStrictEquals(actual, expected);
  });

  it("Can read from a particular file", async () => {
    const actual = await file.readTextFile(`${filePath}/file.txt`);
    assertStrictEquals(actual, "Hello, world!");
  });

  it("Gets an error object when read fails", async () => {
    const path = `${filePath}/file_does_not_exist.txt`;

    const actual = await file.readTextFile(path);

    if (!file.isReadTextFileError(actual)) {
      throw new Error(`Should be an error, but got ${actual}`);
    }

    assertEquals(actual.attemptedPath, path);
    assertEquals(
      {
        errorMessage: actual.errorMessage,
        errorType: actual.errorType,
        isError: actual.isError,
      },
      {
        errorMessage: "No such file or directory (os error 2)",
        errorType: "NotFound",
        isError: true,
      },
    );
  });

  it("Can write to a particular file", async () => {
    const actual = await file.writeTextFile(
      `${filePath}/file.generated.txt`,
      "Foo",
    );
    assertStrictEquals(actual, undefined);
  });

  it("Can write and then read a file", async () => {
    const testFile = `${filePath}/file_write.generated.txt`;
    const timeNow = Date.now();

    await file.writeTextFile(testFile, `${timeNow}`);

    const actual = await file.readTextFile(testFile);

    assertStrictEquals(actual, `${timeNow}\n`);
  });
});
