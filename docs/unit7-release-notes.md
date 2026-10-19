# Unit 7 Release Notes

## Milestone release

Release candidate: `unit-7-docker-resubmission-v0.7.1`

This resubmission candidate extends the Unit 7 milestone with executed container deployment, configuration validation, structural browser-accessibility checks, containerized browser timing, and image vulnerability remediation. It preserves the failed refresh-persistence case as a documented limitation rather than presenting the prototype as production-ready.

## Added

- Dependency-free Google Chrome headless system-test runner.
- Three system tests, two integration tests, and three requirement-based acceptance checks.
- Initial result showing six passes and two failures.
- Corrected result showing seven passes and one valid known limitation.
- Requirement-to-test-and-evidence traceability.
- Corrective, adaptive, perfective, and preventive maintenance strategy.
- Maintenance schedule, change-control workflow, and post-deployment risk review.
- Production-readiness gates and a phased pilot path.
- Sanitized figures and text logs matching the Unit 7 report.
- Eight automated input, deployment, security-header, and structural accessibility checks.
- Seven headless-browser accessibility checks.
- A repeatable 200-sample identity and 200-sample compliance browser benchmark against the running Nginx container.
- Executed Docker build, health, HTTP-response, response-header, and Docker Scout validation.
- Remediation to `nginx:1.30.6-alpine3.24-slim` with a zlib security upgrade.

## Verified

- 16 of 16 policy tests passed.
- Line and function coverage remained 100 percent.
- Branch coverage remained 96.97 percent.
- Seven of eight integrated browser cases passed.
- The access and compliance forms reached the shared policy functions.
- Four completed evaluations appeared in the session log.
- The log cleared when requested.
- Eight of eight additional automated checks passed, bringing the combined automated total to 24 of 24.
- Seven of seven structural browser-accessibility checks passed.
- The final container became healthy and returned HTTP 200 with all four configured security headers.
- Docker Scout indexed 26 packages in the final image and reported no vulnerable packages at the time of the milestone scan.

## Open limitation

AT-03 fails because the prototype stores the decision log only in browser memory. A refresh clears the entries. Persistent logging requires approved audit fields, protected storage, role-based access, retention and deletion rules, recovery procedures, and privacy review before it can be implemented responsibly.

## Boundaries

All evidence uses synthetic values in a controlled local home lab. The browser timing excludes external services, backend processing, database storage, network workloads, and concurrent users. The accessibility checks are structural and do not replace manual keyboard, screen-reader, contrast, zoom, or representative-user evaluation. This release does not claim live Entra ID, Intune, Apple Business Manager, Microsoft Graph, Addigy, production-directory, production-device, or organizational-network testing.
