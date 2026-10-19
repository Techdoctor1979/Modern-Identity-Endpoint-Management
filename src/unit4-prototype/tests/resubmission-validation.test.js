"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { evaluateAccess, evaluateCompliance } = require("../core-logic.js");

const ROOT = path.resolve(__dirname, "..");
const dockerfile = fs.readFileSync(path.join(ROOT, "deployment", "Dockerfile"), "utf8");
const nginx = fs.readFileSync(path.join(ROOT, "deployment", "nginx.conf"), "utf8");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

test("RV-01 rejects invalid non-object policy input", () => {
  assert.throws(() => evaluateAccess(null), /input object is required/i);
  assert.throws(() => evaluateCompliance(undefined), /input object is required/i);
});

test("RV-02 pins the remediated Nginx image", () => {
  assert.match(dockerfile, /^FROM nginx:1\.30\.6-alpine3\.24-slim$/m);
  assert.match(dockerfile, /^RUN apk upgrade --no-cache zlib$/m);
});

test("RV-03 declares a container health check", () => {
  assert.match(dockerfile, /^HEALTHCHECK /m);
  assert.match(dockerfile, /wget -q -O \/dev\/null http:\/\/127\.0\.0\.1\//);
});

test("RV-04 declares the required response security headers", () => {
  ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy"].forEach((header) => {
    assert.match(nginx, new RegExp(`add_header ${header} `));
  });
});

test("RV-05 declares a restrictive Content Security Policy", () => {
  assert.match(nginx, /add_header Content-Security-Policy/);
  assert.match(nginx, /default-src 'self'/);
  assert.match(nginx, /object-src 'none'/);
  assert.match(nginx, /frame-ancestors 'none'/);
});

test("RV-06 includes document language and viewport metadata", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
});

test("RV-07 connects each tab to an accessible panel", () => {
  const panels = ["access", "compliance", "activity"];
  panels.forEach((name) => {
    assert.match(html, new RegExp(`id="${name}-tab"[^>]+role="tab"[^>]+aria-controls="${name}-panel"`));
    assert.match(html, new RegExp(`id="${name}-panel"[^>]+role="tabpanel"[^>]+aria-labelledby="${name}-tab"`));
  });
});

test("RV-08 labels the decision log with a table caption", () => {
  assert.match(html, /<caption[^>]*>Session-only identity access and endpoint compliance decisions<\/caption>/);
});
