(function () {
  "use strict";

  const logEntries = [];

  function value(id) {
    return document.getElementById(id).value;
  }

  function showPanel(panelId) {
    document.querySelectorAll(".feature-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === panelId);
    });
    document.querySelectorAll(".nav-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.panel === panelId);
    });
  }

  function renderResult(elementId, level, title, summary, reasons) {
    const result = document.getElementById(elementId);
    result.className = `result ${level}`;
    const list = reasons.length
      ? `<ul>${reasons.map((reason) => `<li>${reason}</li>`).join("")}</ul>`
      : "";
    result.innerHTML = `<h3>${title}</h3><p>${summary}</p>${list}`;
  }

  function addLog(feature, decision, summary) {
    logEntries.unshift({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      feature,
      decision,
      summary
    });
    const body = document.getElementById("activity-log");
    body.innerHTML = logEntries.map((entry) => (
      `<tr><td>${entry.time}</td><td>${entry.feature}</td><td><strong>${entry.decision}</strong></td><td>${entry.summary}</td></tr>`
    )).join("");
  }

  function evaluateAccess(event) {
    event.preventDefault();
    const account = value("account-status");
    const role = value("user-role");
    const mfa = value("mfa-status");
    const device = value("access-device-status");
    const risk = value("sign-in-risk");
    const resource = value("resource");
    const reasons = [];
    let decision = "GRANT";
    let level = "pass";

    if (account === "disabled") {
      decision = "BLOCK";
      level = "fail";
      reasons.push("The account is disabled.");
    }
    if (risk === "high") {
      decision = "BLOCK";
      level = "fail";
      reasons.push("The sign-in risk is high.");
    }
    if (device === "noncompliant" || device === "unknown") {
      decision = "BLOCK";
      level = "fail";
      reasons.push(device === "noncompliant" ? "The device does not meet the compliance baseline." : "The device compliance state is unknown.");
    }
    if ((role === "administrator" || risk === "medium" || resource === "admin") && mfa === "missing" && decision !== "BLOCK") {
      decision = "REQUIRE MFA";
      level = "warn";
      reasons.push("This request requires multifactor authentication before access can continue.");
    }
    if (decision === "GRANT") {
      reasons.push("The account is active, the device is compliant, and the required authentication conditions are satisfied.");
    }

    const summary = `${role === "administrator" ? "Administrator" : "Standard user"} request for ${resource === "email" ? "organizational email" : resource === "files" ? "shared files" : "the administrative portal"}.`;
    renderResult("access-result", level, decision, summary, reasons);
    addLog("Identity access", decision, reasons.join(" "));
  }

  function evaluateCompliance(event) {
    event.preventDefault();
    const platform = value("platform");
    const checks = [
      [value("managed-status") === "managed", "The endpoint is not enrolled in management."],
      [value("encryption-status") === "enabled", "Encryption is disabled."],
      [value("screen-lock-status") === "enabled", "The required screen lock is disabled."],
      [value("os-status") === "supported", "The operating-system version is unsupported."],
      [value("update-status") === "current", "Required security updates are overdue."]
    ];
    const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
    const decision = failures.length === 0 ? "COMPLIANT" : "NONCOMPLIANT";
    const level = failures.length === 0 ? "pass" : "fail";
    const reasons = failures.length === 0
      ? [`The ${platform} endpoint meets every baseline condition evaluated by this prototype.`]
      : [...failures, "The endpoint requires remediation before it can satisfy a compliant-device access rule."];

    renderResult("compliance-result", level, decision, `${platform} endpoint baseline evaluation.`, reasons);
    addLog("Endpoint compliance", decision, reasons.join(" "));
  }

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.panel));
  });

  document.getElementById("access-form").addEventListener("submit", evaluateAccess);
  document.getElementById("compliance-form").addEventListener("submit", evaluateCompliance);

  document.getElementById("load-access-demo").addEventListener("click", () => {
    document.getElementById("account-status").value = "active";
    document.getElementById("user-role").value = "administrator";
    document.getElementById("mfa-status").value = "missing";
    document.getElementById("access-device-status").value = "noncompliant";
    document.getElementById("sign-in-risk").value = "medium";
    document.getElementById("resource").value = "admin";
  });

  document.getElementById("load-compliance-demo").addEventListener("click", () => {
    document.getElementById("platform").value = "macOS";
    document.getElementById("managed-status").value = "managed";
    document.getElementById("encryption-status").value = "disabled";
    document.getElementById("screen-lock-status").value = "enabled";
    document.getElementById("os-status").value = "supported";
    document.getElementById("update-status").value = "overdue";
  });

  document.getElementById("clear-log").addEventListener("click", () => {
    logEntries.length = 0;
    document.getElementById("activity-log").innerHTML = '<tr class="empty-row"><td colspan="4">No decisions have been recorded.</td></tr>';
  });
})();
