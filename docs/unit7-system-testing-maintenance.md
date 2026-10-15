# Unit 7 System Testing and Maintenance Plan

## Scope and environment

Unit 7 evaluates the complete local prototype and documents how it would be maintained after deployment. The browser interface, controller, identity-access rules, endpoint-compliance rules, result panels, and session decision log were tested together with synthetic values in a controlled home-lab environment.

The results verify the local prototype. They do not claim that Microsoft Entra ID, Microsoft Intune, Apple Business Manager, Microsoft Graph, Addigy, or an organizational directory was configured or tested. Entra ID, Intune, and Apple Business Manager remain the planned production baseline. Addigy remains a contingency only if later authorized testing identifies an Apple-management requirement that the baseline cannot meet.

## Test method

The 16 Unit 5 policy tests were rerun first as a regression baseline. All 16 passed with 100 percent line and function coverage and 96.97 percent branch coverage. The Unit 7 browser suite then started the prototype on a local web server and used Google Chrome in headless mode to enter values through the interface, submit both forms, inspect decisions and reasons, and verify the session log.

The browser suite is dependency-free. It uses the Node.js standard library and Chrome DevTools Protocol, so it does not add browser-automation packages to the prototype. The test file is `src/unit4-prototype/tests/system-tests.js`.

## Requirement-traced results

| ID | Requirement | Level | Expected behavior | Final result |
| --- | --- | --- | --- | --- |
| ST-01 | NFR-03 | System | Complete interface loads | Pass |
| IT-01 | FR-05 | Integration | Access form reaches the policy engine | Pass |
| ST-02 | FR-01 | System | Low-risk compliant request is granted | Pass |
| IT-02 | FR-04, FR-10 | Integration | Endpoint form returns the required reasons | Pass after test correction |
| ST-03 | FR-04 | System | Baseline endpoint is compliant | Pass |
| AT-01 | FR-07 | Acceptance | All completed evaluations appear in the session log | Pass |
| AT-02 | NFR-06 | Acceptance | User can clear the session log | Pass |
| AT-03 | FR-07 | Acceptance | Decision history survives a browser refresh | Fail — known limitation |

The first run produced six passes and two failures. IT-02 expected only two list items even though the interface correctly returned two failed conditions and a separate remediation message. The corrected assertion checks the two required messages by content. The final run produced seven passes and one failure.

AT-03 remains failed because the decision log is stored only in browser memory and clears after refresh. This is an intentional prototype boundary, but it does not satisfy the full event-recording requirement. The failure remains visible rather than being weakened or removed from the test.

## Evaluation summary

| Indicator | Recorded result | Interpretation |
| --- | ---: | --- |
| Unit tests | 16 of 16 passed | Defined policy cases passed |
| Coverage | 100% lines and functions; 96.97% branches | One uncommon branch still needs a focused test |
| System suite | 7 passed; 1 failed | Log persistence remains open |
| Access latency | 0.176 microseconds median | Unit 7 local policy-function rerun |
| Compliance latency | 0.219 microseconds median | Unit 7 local policy-function rerun |
| Usability review | 4.67 out of 5 | Initial single-reviewer result from Unit 6 |

The latency measurements are development baselines for local JavaScript functions. They exclude browser rendering, authentication, network delay, vendor APIs, databases, audit storage, and concurrent users. They must not be treated as production-capacity evidence.

## Maintenance strategy

All four maintenance types apply to the proposed system:

- Corrective maintenance addresses confirmed defects, failed tests, and incorrect policy decisions.
- Adaptive maintenance responds to browser, operating-system, Microsoft-service, Apple-workflow, API, or vendor changes.
- Perfective maintenance improves remediation guidance, reporting, accessibility, and administrative workflow.
- Preventive maintenance includes dependency review, security scanning, regression testing, recovery exercises, documentation review, and unused-code removal.

| Frequency | Review area | Expected action |
| --- | --- | --- |
| Continuous | Health and security events | Alert and triage |
| Weekly | Failures, incidents, and open issues | Prioritize and assign |
| Monthly | Dependencies, supported platforms, vendor notices, and regression results | Patch and retest |
| Quarterly | Access, privacy, configuration, usability, and performance | Review the approved baseline |
| Semiannual | Rollback, recovery, licensing, and vendor support | Exercise and document |
| Annual | Architecture, retention, and continuity | Approve revisions |

## Change and configuration control

A maintenance request begins as an issue that identifies the affected requirement, severity, reproduction steps, and evidence. The change is prepared on a focused branch, reviewed, and tested with the unit and system suites. Approved changes are merged through the normal branch sequence and preserved with release notes and a milestone tag. Code, tests, configuration examples, diagrams, results, and documentation remain part of the same controlled baseline.

No credentials, tokens, tenant identifiers, device serial numbers, production exports, or unnecessary personal information belong in the repository. Persistent audit storage would require approved fields, role-based access, encryption, retention limits, deletion procedures, recovery tests, and privacy review before implementation.

## Post-deployment risks

| Risk | Possible effect | Planned mitigation |
| --- | --- | --- |
| Security vulnerability | Compromise or unauthorized access | Patch, monitor, enforce least privilege, and retain rollback |
| Vendor or API change | Broken integration or missing evidence | Monitor releases, use contract tests, and stage changes |
| Data inconsistency | Incorrect access or compliance decision | Validate inputs, reconcile records, and fail safely |
| Privacy or log exposure | Unnecessary PII collection or retention | Minimize fields, restrict access, and enforce retention limits |
| Usability problem | Users cannot understand remediation | Conduct task testing and improve role-appropriate guidance |
| Outage or configuration drift | Unavailable or inconsistent service | Use health checks, fallback procedures, and versioned configuration |

## Production-readiness path

The current prototype is not production-ready. Before an organizational pilot, AT-03 must be corrected with approved audit storage and the replacement must pass storage, access, retention, deletion, recovery, and regression tests. Security, privacy, accessibility, licensing, policy ownership, support procedures, and rollback criteria also require stakeholder approval.

The next authorized phase would connect a nonproduction Microsoft tenant, configure Apple Business Manager for eligible organizational Apple devices, and test representative Windows, macOS, iOS, and iPadOS devices. A limited pilot would measure MFA success, enrollment success, policy accuracy, remediation time, help-desk demand, user feedback, and service reliability. Deployment would expand only through controlled groups with coexistence and rollback available until documented exit criteria are met.

## Run the tests locally

From the prototype folder:

```text
cd Modern-Identity-Endpoint-Management/src/unit4-prototype
node --test --experimental-test-coverage tests/core-logic.test.js
node tests/system-tests.js
```

The system suite requires Google Chrome or Chromium. On macOS it automatically checks the standard application location. On another platform, set `CHROME_PATH` to the browser executable if it is not found automatically.

To reproduce the original assertion problem for documentation purposes only:

```text
node tests/system-tests.js --initial-assertion
```

The normal system-test command returns a successful process status when AT-03 is the only failed case because it is an explicitly documented open limitation. Any other failed case returns an error status.
