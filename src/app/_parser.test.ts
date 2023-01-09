import { assertStrictEquals } from "@test_deps/assert.ts";
import { describe, it } from "@test_deps/bdd.ts";

describe("Test", () => {
  it("is true", () => {
    assertStrictEquals(true, true);
  });
});
