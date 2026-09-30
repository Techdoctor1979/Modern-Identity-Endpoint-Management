"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { evaluateAccess, evaluateCompliance } = require("../core-logic.js");

const validAccess = {
  account: "active",
  role: "standard",
  mfa: "complete",
  device: "compliant",
  risk: "low",
  resource: "email"
};

const validEndpoint = {
  platform: "Windows",
  managed: "managed",
  encryption: "enabled",
  screenLock: "enabled",
  os: "supported",
  updates: "current"
};

test("UT-01 grants a low-risk request that satisfies the access baseline", () => {
  assert.equal(evaluateAccess(validAccess).decision, "GRANT");
});

test("UT-02 blocks a disabled account", () => {
  const result = evaluateAccess({ ...validAccess, account: "disabled" });
  assert.equal(result.decision, "BLOCK");
  assert.match(result.reasons.join(" "), /disabled/);
});

test("UT-03 blocks a high-risk sign-in", () => {
  assert.equal(evaluateAccess({ ...validAccess, risk: "high" }).decision, "BLOCK");
});

test("UT-04 blocks a noncompliant device", () => {
  assert.equal(evaluateAccess({ ...validAccess, device: "noncompliant" }).decision, "BLOCK");
});

test("UT-05 blocks an unknown device state", () => {
  assert.equal(evaluateAccess({ ...validAccess, device: "unknown" }).decision, "BLOCK");
});

test("UT-06 requires MFA for an administrator", () => {
  const result = evaluateAccess({ ...validAccess, role: "administrator", mfa: "missing" });
  assert.equal(result.decision, "REQUIRE MFA");
});

test("UT-07 requires MFA for a medium-risk request", () => {
  const result = evaluateAccess({ ...validAccess, risk: "medium", mfa: "missing" });
  assert.equal(result.decision, "REQUIRE MFA");
});

test("UT-08 requires MFA for the administrative portal", () => {
  const result = evaluateAccess({ ...validAccess, resource: "admin", mfa: "missing" });
  assert.equal(result.decision, "REQUIRE MFA");
});

test("UT-09 block takes priority over an MFA requirement", () => {
  const result = evaluateAccess({ ...validAccess, account: "disabled", role: "administrator", mfa: "missing" });
  assert.equal(result.decision, "BLOCK");
});

test("UT-10 rejects an unsupported access value", () => {
  assert.throws(() => evaluateAccess({ ...validAccess, risk: "severe" }), /Unsupported risk value/);
});

test("UT-11 marks an endpoint compliant when every baseline check passes", () => {
  assert.equal(evaluateCompliance(validEndpoint).decision, "COMPLIANT");
});

test("UT-12 marks an unmanaged endpoint noncompliant", () => {
  assert.equal(evaluateCompliance({ ...validEndpoint, managed: "unmanaged" }).decision, "NONCOMPLIANT");
});

test("UT-13 reports every failed compliance condition", () => {
  const result = evaluateCompliance({
    ...validEndpoint,
    encryption: "disabled",
    screenLock: "disabled",
    os: "unsupported",
    updates: "overdue"
  });
  assert.equal(result.decision, "NONCOMPLIANT");
  assert.equal(result.reasons.length, 5);
});

test("UT-14 supports each endpoint platform", () => {
  ["Windows", "macOS", "iOS", "iPadOS"].forEach((platform) => {
    assert.equal(evaluateCompliance({ ...validEndpoint, platform }).decision, "COMPLIANT");
  });
});

test("UT-15 rejects an unsupported endpoint value", () => {
  assert.throws(() => evaluateCompliance({ ...validEndpoint, updates: "unknown" }), /Unsupported updates value/);
});

test("UT-16 requires an input object", () => {
  assert.throws(() => evaluateAccess(), /input object is required/);
});
