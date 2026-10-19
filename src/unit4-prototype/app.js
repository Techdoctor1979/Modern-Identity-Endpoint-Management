(function () {
  "use strict";

  const logEntries = [];

  function value(id) {
    return document.getElementById(id).value;
  }

  function showPanel(panelId) {
    document.querySelectorAll(".feature-panel").forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
    document.querySelectorAll(".nav-button").forEach((button) => {
      const isActive = button.dataset.panel === panelId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });
  }

  function renderResult(elementId, result, summary) {
    const element = document.getElementById(elementId);
    const plainLanguage = {
      GRANT: "Access is allowed.",
      "REQUIRE MFA": "Complete an additional identity check to continue.",
      BLOCK: "Access is not allowed because one or more security requirements were not met.",
      COMPLIANT: "The device meets the evaluated security requirements.",
      NONCOMPLIANT: "The device does not currently meet all evaluated security requirements."
    };
    element.className = `result ${result.level}`;
    element.innerHTML = `<h3>${result.decision}</h3><p class="decision-meaning"><strong>${plainLanguage[result.decision]}</strong></p><p>${summary}</p><ul>${result.reasons.map((reason) => `<li>${reason}</li>`).join("")}</ul>`;
  }

  function addLog(feature, result) {
    logEntries.unshift({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      feature,
      decision: result.decision,
      summary: result.reasons.join(" ")
    });
    document.getElementById("activity-log").innerHTML = logEntries.map((entry) => (
      `<tr><td>${entry.time}</td><td>${entry.feature}</td><td><strong>${entry.decision}</strong></td><td>${entry.summary}</td></tr>`
    )).join("");
  }

  function evaluateAccess(event) {
    event.preventDefault();
    const input = {
      account: value("account-status"),
      role: value("user-role"),
      mfa: value("mfa-status"),
      device: value("access-device-status"),
      risk: value("sign-in-risk"),
      resource: value("resource")
    };
    const result = window.PolicyEngine.evaluateAccess(input);
    const summary = `${input.role === "administrator" ? "Administrator" : "Standard user"} request for ${input.resource === "email" ? "organizational email" : input.resource === "files" ? "shared files" : "the administrative portal"}.`;
    renderResult("access-result", result, summary);
    addLog("Identity access", result);
  }

  function evaluateCompliance(event) {
    event.preventDefault();
    const input = {
      platform: value("platform"),
      managed: value("managed-status"),
      encryption: value("encryption-status"),
      screenLock: value("screen-lock-status"),
      os: value("os-status"),
      updates: value("update-status")
    };
    const result = window.PolicyEngine.evaluateCompliance(input);
    renderResult("compliance-result", result, `${input.platform} endpoint baseline evaluation.`);
    addLog("Endpoint compliance", result);
  }

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.panel));
    button.addEventListener("keydown", (event) => {
      const tabs = [...document.querySelectorAll('.nav-button[role="tab"]')];
      const currentIndex = tabs.indexOf(button);
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      showPanel(tabs[nextIndex].dataset.panel);
      tabs[nextIndex].focus();
    });
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
}());
