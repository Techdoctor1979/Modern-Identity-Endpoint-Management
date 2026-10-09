# Unit 6 Integration, Evaluation, and Deployment Planning

## Scope and environment

Unit 6 connects the browser interface, controller, policy functions, result panels, and temporary decision log into one traceable workflow. The work was completed in a controlled local home-lab environment with synthetic inputs. It does not connect to Microsoft Entra ID, Microsoft Intune, Apple Business Manager, Addigy, a production directory, or an organizational network.

The prototype accepts representative Windows, macOS, iOS, and iPadOS values. These values allow the proposed rules and data flow to be evaluated without presenting simulated behavior as evidence of a live vendor integration. Entra ID, Intune, and Apple Business Manager remain the planned platform baseline. Addigy remains a contingency only if later authorized testing identifies an Apple-management requirement that the baseline cannot meet.

## Integrated workflow

The user selects sample conditions in `index.html`. The controller in `app.js` converts those selections into a structured object and calls either `evaluateAccess` or `evaluateCompliance` in `core-logic.js`. The returned decision, level, and reasons are displayed in the interface and added to the browser-session decision log.

The same policy functions are called by the interface, automated tests, and performance benchmark. Keeping the rules outside the page event handlers reduces the chance that the visible demonstration and the test suite use different logic.

Two representative scenarios were used for the integration review:

1. An active administrator requests the administrative portal without completed MFA while using a noncompliant device. The result is `BLOCK` because a device failure takes priority over an MFA-only response.
2. A managed macOS endpoint has encryption disabled and security updates overdue. The result is `NONCOMPLIANT`, and both failed conditions appear in the output.

After both scenarios are run, the session log contains one identity-access result and one endpoint-compliance result. The log is cleared when the page reloads and is not presented as a production audit system.

## Requirement and evidence traceability

| Requirement | Test or review | Evidence | Result |
| --- | --- | --- | --- |
| FR-02 | UT-06 through UT-09 | MFA and blocking-priority tests | Pass |
| FR-04 | UT-11 through UT-15 | Endpoint baseline and validation tests | Pass |
| FR-05 | UT-04 and UT-09 | Blocked-access output and automated tests | Pass |
| FR-07 | U4-TC-06 integration review | Session decision-log screenshot | Pass within prototype |
| FR-10 | UT-02 and UT-13 | Displayed access and compliance reasons | Pass |
| NFR-04 | Local benchmark | Latency and throughput results | Baseline recorded |
| NFR-07 | UT-01 through UT-16 | Repeatable test and configuration files | Pass |
| NFR-08 | UT-14 | Windows, macOS, iOS, and iPadOS inputs | Pass |

## Evaluation results

The Unit 5 automated suite was rerun as a regression baseline. All 16 tests passed. Coverage was 100 percent for executable lines and functions and 96.97 percent for branches. The remaining branch should receive a targeted test in a later revision, so complete line coverage is not treated as proof that every possible policy combination is correct.

The local benchmark used 10,000 warm-up evaluations followed by seven trials of 250,000 evaluations for each policy function. The recorded median results were:

| Indicator | Recorded result | Interpretation |
| --- | ---: | --- |
| Identity-access latency | 0.170 microseconds | Local policy-function processing only |
| Identity-access throughput | 5.88 million evaluations per second | Useful for comparing later logic revisions |
| Endpoint-compliance latency | 0.213 microseconds | Slightly higher because more conditions are checked |
| Endpoint-compliance throughput | 4.70 million evaluations per second | Local policy-function baseline only |

These measurements exclude browser rendering, network delay, authentication, vendor APIs, databases, audit storage, and concurrent users. They are development baselines, not production-capacity claims.

A six-criterion heuristic review produced a mean score of 4.67 out of 5. Input clarity, navigation consistency, decision visibility, and privacy wording were the strongest areas. Remediation guidance and error recovery were weaker. The review was completed by one reviewer, so it is an initial usability check rather than a formal user study.

## Deployment and configuration plan

Direct file access, a manually configured internal web server, and a Docker container were considered. Docker with Nginx was selected as the planned nonproduction method because the image can preserve the reviewed application files and server settings. The repository includes a Dockerfile, Nginx configuration, example nonsecret settings, a health check, security headers, and documented build and rollback steps.

The current prototype does not require runtime secrets or environment variables. A future authorized integration would keep credentials, tokens, certificates, tenant identifiers, and other secrets outside the repository in an approved secret-management service.

The Docker configuration is a deployment plan and has not been represented as a completed production deployment. A later release should be built from a reviewed tag, tested in nonproduction, checked for basic health and security, approved, and promoted while retaining the previous image for rollback.

## Local Mac setup and validation

Open Terminal in the folder that contains the cloned repository, then run the following commands:

```text
cd Modern-Identity-Endpoint-Management/src/unit4-prototype
node --version
python3 --version
node --test --experimental-test-coverage tests/core-logic.test.js
node scripts/performance-benchmark.js
python3 -m http.server 8765
open http://127.0.0.1:8765
```

Use the browser interface to exercise the blocked-access, noncompliant endpoint, iOS or iPadOS, and decision-log workflows. Return to Terminal and press `Control-C` to stop the local server. The prototype uses the built-in Node.js test runner and has no external package dependencies. If Terminal reports that `node` is unavailable, install Node.js before continuing. The `core-logic.js` file is loaded by the browser and imported by the tests; it is not opened as a standalone Mac application.

## Limitations and next work

The current evidence demonstrates the local policy and interface workflow. It does not prove live Entra ID, Intune, Microsoft Graph, or Apple Business Manager behavior. A later authorized phase would require a protected backend, nonproduction tenant access, representative test devices, minimized audit records, and platform-specific enrollment evidence.

The next evaluation should add a targeted test for the remaining branch, accessibility checks, representative-user tasks, end-to-end timing, external-service failure cases, and percentile-based performance reporting. Licensing, procurement, training, support, and migration overlap also remain part of the final organizational recommendation.

## Supporting references

- [AWS: What is unit testing?](https://aws.amazon.com/what-is/unit-testing/)
- [Dockerfile overview](https://docs.docker.com/build/concepts/dockerfile/)
- [LaunchNotes: Qualitative vs. quantitative metrics](https://www.launchnotes.com/blog/qualitative-vs-quantitative-metrics-a-comprehensive-comparison)
- [Microsoft: Supported operating systems and browsers in Intune](https://learn.microsoft.com/en-us/intune/fundamentals/ref-supported-platforms)
- [Node.js test runner](https://nodejs.org/api/test.html)
