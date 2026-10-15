"use strict";

const http = require("node:http");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const APP_PORT = 8767;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const APP_ROOT = path.resolve(__dirname, "..");
const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

const initialAssertion = process.argv.includes("--initial-assertion");

function contentType(filePath) {
  return ({
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  })[path.extname(filePath)] || "application/octet-stream";
}

function startServer() {
  const server = http.createServer((request, response) => {
    const requested = request.url === "/" ? "/index.html" : request.url.split("?", 1)[0];
    const filePath = path.resolve(APP_ROOT, `.${requested}`);

    if (!filePath.startsWith(`${APP_ROOT}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
        return;
      }
      response.writeHead(200, { "Content-Type": contentType(filePath) });
      response.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(APP_PORT, "127.0.0.1", () => resolve(server));
  });
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

function locateChrome() {
  const chromePath = CHROME_PATHS.find((candidate) => fs.existsSync(candidate));
  if (!chromePath) {
    throw new Error("Google Chrome or Chromium was not found. Set CHROME_PATH and try again.");
  }
  return chromePath;
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
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
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
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
    }
    return result.result.value;
  }

  close() {
    this.socket.close();
  }
}

async function waitForReady(client) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (await client.evaluate("document.readyState")) {
      const state = await client.evaluate("document.readyState");
      if (state === "complete") return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("The prototype did not finish loading.");
}

function record(results, id, requirement, level, description, expected, actual) {
  results.push({
    id,
    requirement,
    level,
    description,
    expected: String(expected),
    actual: String(actual),
    passed: String(expected) === String(actual)
  });
}

function printReport(results) {
  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;
  console.log("UNIT 7 SYSTEM TEST SUMMARY");
  console.log(`Environment: Google Chrome headless at ${APP_URL}`);
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("");

  results.forEach((result) => {
    const status = result.passed ? "PASS" : "FAIL";
    console.log(`${status} ${result.id} [${result.requirement}] [${result.level}] ${result.description}`);
    console.log(`  Expected: ${result.expected}`);
    console.log(`  Actual:   ${result.actual}`);
  });

  console.log("");
  console.log("Known limitation: AT-03 fails because the current demonstration log is intentionally stored only in browser memory. Persistent, privacy-controlled audit storage is planned for a later authorized implementation.");
}

async function run() {
  const results = [];
  const server = await startServer();
  const debugPort = await findAvailablePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "unit7-chrome-"));
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
    if (!pageResponse.ok) throw new Error("Chrome did not create the test page.");
    const page = await pageResponse.json();
    client = new DevToolsClient(page.webSocketDebuggerUrl);
    await client.open();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await waitForReady(client);

    const title = await client.evaluate("document.title");
    record(results, "ST-01", "NFR-03", "System", "Load the complete prototype interface", "Identity and Endpoint Management Prototype", title);

    const blocked = await client.evaluate(`(() => {
      document.getElementById("load-access-demo").click();
      document.getElementById("access-form").requestSubmit();
      return document.querySelector("#access-result h3").textContent;
    })()`);
    record(results, "IT-01", "FR-05", "Integration", "Send access form data through the controller to the policy engine", "BLOCK", blocked);

    const granted = await client.evaluate(`(() => {
      document.getElementById("account-status").value = "active";
      document.getElementById("user-role").value = "standard";
      document.getElementById("mfa-status").value = "complete";
      document.getElementById("access-device-status").value = "compliant";
      document.getElementById("sign-in-risk").value = "low";
      document.getElementById("resource").value = "email";
      document.getElementById("access-form").requestSubmit();
      return document.querySelector("#access-result h3").textContent;
    })()`);
    record(results, "ST-02", "FR-01", "System", "Grant a low-risk compliant access request", "GRANT", granted);

    const endpointResult = await client.evaluate(`(() => {
      document.querySelector('[data-panel="compliance-panel"]').click();
      document.getElementById("load-compliance-demo").click();
      document.getElementById("compliance-form").requestSubmit();
      const decision = document.querySelector("#compliance-result h3").textContent;
      const reasons = [...document.querySelectorAll("#compliance-result li")].map((item) => item.textContent);
      return {
        decision,
        count: reasons.length,
        encryption: reasons.some((reason) => reason.includes("Encryption is disabled")),
        updates: reasons.some((reason) => reason.includes("security updates are overdue"))
      };
    })()`);
    if (initialAssertion) {
      record(results, "IT-02", "FR-04 / FR-10", "Integration", "Send endpoint form data through the controller to the compliance engine", "NONCOMPLIANT|2", `${endpointResult.decision}|${endpointResult.count}`);
    } else {
      record(results, "IT-02", "FR-04 / FR-10", "Integration", "Send endpoint form data through the controller to the compliance engine", "NONCOMPLIANT|true|true", `${endpointResult.decision}|${endpointResult.encryption}|${endpointResult.updates}`);
    }

    const compliant = await client.evaluate(`(() => {
      document.getElementById("platform").value = "Windows";
      document.getElementById("managed-status").value = "managed";
      document.getElementById("encryption-status").value = "enabled";
      document.getElementById("screen-lock-status").value = "enabled";
      document.getElementById("os-status").value = "supported";
      document.getElementById("update-status").value = "current";
      document.getElementById("compliance-form").requestSubmit();
      return document.querySelector("#compliance-result h3").textContent;
    })()`);
    record(results, "ST-03", "FR-04", "System", "Approve an endpoint that satisfies the baseline", "COMPLIANT", compliant);

    const logCount = await client.evaluate(`(() => {
      document.querySelector('[data-panel="activity-panel"]').click();
      return document.querySelectorAll("#activity-log tr:not(.empty-row)").length;
    })()`);
    record(results, "AT-01", "FR-07", "Acceptance", "Record every completed evaluation in the session decision log", 4, logCount);

    const cleared = await client.evaluate(`(() => {
      document.getElementById("clear-log").click();
      return document.getElementById("activity-log").textContent.trim();
    })()`);
    record(results, "AT-02", "NFR-06", "Acceptance", "Clear the session decision log when requested", "No decisions have been recorded.", cleared);

    await client.evaluate(`(() => {
      document.querySelector('[data-panel="access-panel"]').click();
      document.getElementById("access-form").requestSubmit();
    })()`);
    await client.send("Page.reload", { ignoreCache: true });
    await waitForReady(client);
    const retained = await client.evaluate(`(() => {
      document.querySelector('[data-panel="activity-panel"]').click();
      return document.querySelectorAll("#activity-log tr:not(.empty-row)").length;
    })()`);
    record(results, "AT-03", "FR-07", "Acceptance", "Retain decision history after a browser refresh", 1, retained);

    printReport(results);
    const unexpectedFailures = results.filter((result) => !result.passed && result.id !== "AT-03");
    if (unexpectedFailures.length > 0) process.exitCode = 1;
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
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(profile, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200
    });
  }
}

run().catch((error) => {
  console.error(`System test error: ${error.message}`);
  process.exitCode = 1;
});
