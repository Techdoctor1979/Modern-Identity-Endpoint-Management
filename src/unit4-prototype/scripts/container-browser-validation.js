"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { performance } = require("node:perf_hooks");
const { spawn } = require("node:child_process");

const APP_URL = process.env.PROTOTYPE_URL || "http://127.0.0.1:8080/";
const SAMPLE_COUNT = Number.parseInt(process.env.SAMPLE_COUNT || "200", 10);
const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

function locateChrome() {
  const chromePath = CHROME_PATHS.find((candidate) => fs.existsSync(candidate));
  if (!chromePath) throw new Error("Google Chrome or Chromium was not found. Set CHROME_PATH and try again.");
  return chromePath;
}

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForJson(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class DevToolsClient {
  constructor(webSocketUrl) {
    this.socket = new WebSocket(webSocketUrl);
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
    return result.result.value;
  }

  close() {
    this.socket.close();
  }
}

async function waitForReady(client) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (await client.evaluate("document.readyState") === "complete") return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("The containerized prototype did not finish loading.");
}

function percentile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil(fraction * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

function metrics(values) {
  return {
    samples: values.length,
    p50: percentile(values, 0.50),
    p95: percentile(values, 0.95),
    p99: percentile(values, 0.99),
    maximum: Math.max(...values)
  };
}

function formatMs(value) {
  return `${value.toFixed(3)} ms`;
}

async function measureWorkflow(client, expression) {
  const values = [];
  for (let i = 0; i < SAMPLE_COUNT; i += 1) {
    await client.evaluate('document.getElementById("clear-log").click()');
    const started = performance.now();
    const decision = await client.evaluate(expression);
    values.push(performance.now() - started);
    if (!decision) throw new Error("The workflow did not produce a visible decision.");
  }
  return metrics(values);
}

function check(name, passed, detail) {
  return { name, passed: Boolean(passed), detail };
}

async function run() {
  const debugPort = await findAvailablePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "unit7-container-chrome-"));
  const chrome = spawn(locateChrome(), [
    "--headless",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-allow-origins=*",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    "about:blank"
  ], { stdio: "ignore" });

  let client;
  try {
    await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
    const pageResponse = await fetch(
      `http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(APP_URL)}`,
      { method: "PUT" }
    );
    if (!pageResponse.ok) throw new Error("Chrome did not create the validation page.");
    const page = await pageResponse.json();
    client = new DevToolsClient(page.webSocketDebuggerUrl);
    await client.open();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await waitForReady(client);

    const accessibility = await client.evaluate(`(() => {
      const tabs = [...document.querySelectorAll('[role="tab"]')];
      const panels = [...document.querySelectorAll('[role="tabpanel"]')];
      const notice = document.querySelector('[aria-label="Prototype notice"]');
      return {
        language: document.documentElement.lang,
        navigationLabel: document.querySelector('[role="tablist"]')?.getAttribute('aria-label') || '',
        tabsConnected: tabs.length === 3 && tabs.every((tab) => document.getElementById(tab.getAttribute('aria-controls'))),
        panelsLabelled: panels.length === 3 && panels.every((panel) => document.getElementById(panel.getAttribute('aria-labelledby'))),
        liveRegions: [...document.querySelectorAll('.result')].length === 2 && [...document.querySelectorAll('.result')].every((region) => region.getAttribute('aria-live') === 'polite'),
        caption: document.querySelector('#activity-panel caption')?.textContent.trim() || '',
        notice: notice?.textContent.trim() || ''
      };
    })()`);

    const checks = [
      check("A11Y-01 document language metadata", accessibility.language === "en", accessibility.language),
      check("A11Y-02 labeled tab navigation", accessibility.navigationLabel === "Prototype features", accessibility.navigationLabel),
      check("A11Y-03 tabs reference existing panels", accessibility.tabsConnected, String(accessibility.tabsConnected)),
      check("A11Y-04 panels reference their tab labels", accessibility.panelsLabelled, String(accessibility.panelsLabelled)),
      check("A11Y-05 result regions announce updates", accessibility.liveRegions, String(accessibility.liveRegions)),
      check("A11Y-06 decision log has a caption", accessibility.caption.length > 0, accessibility.caption),
      check("A11Y-07 notice identifies synthetic nonproduction data", /synthetic/i.test(accessibility.notice) && /nonproduction/i.test(accessibility.notice), accessibility.notice)
    ];

    const identity = await measureWorkflow(client, `(() => {
      document.querySelector('[data-panel="access-panel"]').click();
      document.getElementById('account-status').value = 'active';
      document.getElementById('user-role').value = 'administrator';
      document.getElementById('mfa-status').value = 'missing';
      document.getElementById('access-device-status').value = 'compliant';
      document.getElementById('sign-in-risk').value = 'medium';
      document.getElementById('resource').value = 'admin';
      document.getElementById('access-form').requestSubmit();
      return document.querySelector('#access-result h3').textContent;
    })()`);

    const compliance = await measureWorkflow(client, `(() => {
      document.querySelector('[data-panel="compliance-panel"]').click();
      document.getElementById('platform').value = 'macOS';
      document.getElementById('managed-status').value = 'managed';
      document.getElementById('encryption-status').value = 'disabled';
      document.getElementById('screen-lock-status').value = 'enabled';
      document.getElementById('os-status').value = 'supported';
      document.getElementById('update-status').value = 'overdue';
      document.getElementById('compliance-form').requestSubmit();
      return document.querySelector('#compliance-result h3').textContent;
    })()`);

    console.log("UNIT 7 CONTAINER BROWSER VALIDATION");
    console.log(`Target: ${APP_URL}`);
    checks.forEach((item) => console.log(`${item.passed ? "PASS" : "FAIL"} ${item.name} | ${item.detail}`));
    console.log(`Accessibility: ${checks.filter((item) => item.passed).length} of ${checks.length} passed`);
    console.log("");
    console.log(`Identity access: ${identity.samples} samples | p50 ${formatMs(identity.p50)} | p95 ${formatMs(identity.p95)} | p99 ${formatMs(identity.p99)} | max ${formatMs(identity.maximum)}`);
    console.log(`Endpoint compliance: ${compliance.samples} samples | p50 ${formatMs(compliance.p50)} | p95 ${formatMs(compliance.p95)} | p99 ${formatMs(compliance.p99)} | max ${formatMs(compliance.maximum)}`);
    console.log("Boundary: local browser submission and rendering through the running Nginx container; excludes external services, backend processing, database storage, network workloads, and concurrent users.");

    if (checks.some((item) => !item.passed)) process.exitCode = 1;
  } finally {
    if (client) client.close();
    const chromeExited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill("SIGTERM");
    const exitedCleanly = await Promise.race([
      chromeExited.then(() => true),
      new Promise((resolve) => setTimeout(() => resolve(false), 2000))
    ]);
    if (!exitedCleanly) {
      chrome.kill("SIGKILL");
      await chromeExited;
    }
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (error) {
      console.warn(`Chrome profile cleanup warning: ${error.message}`);
    }
  }
}

run().catch((error) => {
  console.error(`Container browser validation error: ${error.message}`);
  process.exitCode = 1;
});
