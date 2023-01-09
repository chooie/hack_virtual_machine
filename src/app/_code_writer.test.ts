import { assertStrictEquals } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

describe("Test", () => {
  it("is false", () => {
    assertStrictEquals(true, true);
  });
});
