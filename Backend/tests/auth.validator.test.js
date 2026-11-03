import assert from "node:assert/strict";
import test from "node:test";
import { registerSchema } from "../src/validators/auth.validator.js";

test("accepts admin registration without an invitation code", () => {
  const result = registerSchema.safeParse({
    fullname: "ShopNow Admin",
    email: "admin@example.test",
    password: "StrongPass1!",
    role: "admin",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.role, "admin");
});
