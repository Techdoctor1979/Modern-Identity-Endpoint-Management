# Unit 7 Release Notes

## Milestone release

Tag: `unit-7-system-testing-maintenance-v0.7.0`

This milestone adds repeatable system-level testing and a maintenance plan to the integrated local prototype. It preserves the failed refresh-persistence case as a documented limitation rather than presenting the prototype as production-ready.

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

## Verified

- 16 of 16 policy tests passed.
- Line and function coverage remained 100 percent.
- Branch coverage remained 96.97 percent.
- Seven of eight integrated browser cases passed.
- The access and compliance forms reached the shared policy functions.
- Four completed evaluations appeared in the session log.
- The log cleared when requested.

## Open limitation

AT-03 fails because the prototype stores the decision log only in browser memory. A refresh clears the entries. Persistent logging requires approved audit fields, protected storage, role-based access, retention and deletion rules, recovery procedures, and privacy review before it can be implemented responsibly.

## Boundaries

All evidence uses synthetic values in a controlled local home lab. This release does not claim live Entra ID, Intune, Apple Business Manager, Microsoft Graph, Addigy, production-directory, production-device, or organizational-network testing.
