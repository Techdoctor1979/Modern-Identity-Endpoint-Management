(function (root, factory) {
  "use strict";

  const policyEngine = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = policyEngine;
  }

  root.PolicyEngine = policyEngine;
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ACCESS_VALUES = {
    account: ["active", "disabled"],
    role: ["standard", "administrator"],
    mfa: ["complete", "missing"],
    device: ["compliant", "noncompliant", "unknown"],
    risk: ["low", "medium", "high"],
    resource: ["email", "files", "admin"]
  };

  const COMPLIANCE_VALUES = {
    platform: ["Windows", "macOS", "iOS", "iPadOS"],
    managed: ["managed", "unmanaged"],
    encryption: ["enabled", "disabled"],
    screenLock: ["enabled", "disabled"],
    os: ["supported", "unsupported"],
    updates: ["current", "overdue"]
  };

  function validateInput(input, allowedValues) {
    if (!input || typeof input !== "object") {
      throw new TypeError("A policy input object is required.");
    }

    Object.entries(allowedValues).forEach(([field, allowed]) => {
      if (!allowed.includes(input[field])) {
        throw new RangeError(`Unsupported ${field} value: ${String(input[field])}`);
      }
    });
  }

  function evaluateAccess(input) {
    validateInput(input, ACCESS_VALUES);

    const reasons = [];
    let decision = "GRANT";
    let level = "pass";

    if (input.account === "disabled") {
      decision = "BLOCK";
      level = "fail";
      reasons.push("The account is disabled.");
    }

    if (input.risk === "high") {
      decision = "BLOCK";
      level = "fail";
      reasons.push("The sign-in risk is high.");
    }

    if (input.device === "noncompliant" || input.device === "unknown") {
      decision = "BLOCK";
      level = "fail";
      reasons.push(input.device === "noncompliant"
        ? "The device does not meet the compliance baseline."
        : "The device compliance state is unknown.");
    }

    const requiresMfa = input.role === "administrator"
      || input.risk === "medium"
      || input.resource === "admin";

    if (requiresMfa && input.mfa === "missing" && decision !== "BLOCK") {
      decision = "REQUIRE MFA";
      level = "warn";
      reasons.push("This request requires multifactor authentication before access can continue.");
    }

    if (decision === "GRANT") {
      reasons.push("The account is active, the device is compliant, and the required authentication conditions are satisfied.");
    }

    return { decision, level, reasons };
  }

  function evaluateCompliance(input) {
    validateInput(input, COMPLIANCE_VALUES);

    const checks = [
      [input.managed === "managed", "The endpoint is not enrolled in management."],
      [input.encryption === "enabled", "Encryption is disabled."],
      [input.screenLock === "enabled", "The required screen lock is disabled."],
      [input.os === "supported", "The operating-system version is unsupported."],
      [input.updates === "current", "Required security updates are overdue."]
    ];
    const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);

    if (failures.length === 0) {
      return {
        decision: "COMPLIANT",
        level: "pass",
        reasons: [`The ${input.platform} endpoint meets every baseline condition evaluated by this prototype.`]
      };
    }

    return {
      decision: "NONCOMPLIANT",
      level: "fail",
      reasons: [...failures, "The endpoint requires remediation before it can satisfy a compliant-device access rule."]
    };
  }

  return { evaluateAccess, evaluateCompliance };
}));
