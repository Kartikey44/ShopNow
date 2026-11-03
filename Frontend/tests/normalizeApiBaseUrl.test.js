import assert from "node:assert/strict";
import test from "node:test";
import { normalizeApiBaseUrl } from "../src/api/normalizeApiBaseUrl.js";

test("adds the API prefix to a backend origin", () => {
  assert.equal(
    normalizeApiBaseUrl("https://shopnow-d3tl.onrender.com"),
    "https://shopnow-d3tl.onrender.com/api",
  );
});

test("preserves an existing API prefix and removes trailing slashes", () => {
  assert.equal(
    normalizeApiBaseUrl("https://shopnow-d3tl.onrender.com/api/"),
    "https://shopnow-d3tl.onrender.com/api",
  );
});

test("does not invent a base URL when configuration is absent", () => {
  assert.equal(normalizeApiBaseUrl(undefined), undefined);
  assert.equal(normalizeApiBaseUrl(""), "");
});
