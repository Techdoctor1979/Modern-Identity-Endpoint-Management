# Unit 6 Release Notes

## Release

Corrected tag: `unit-6-integration-evaluation-v0.6.1`

Version 0.6.1 carries the validated Unit 6 milestone forward without changing the policy logic or recorded results. Version 0.6.0 remains available as the original milestone release.

This milestone moves the project from isolated policy testing to an integrated local workflow and records the first structured system-evaluation and deployment-planning evidence.

## Corrected in version 0.6.1

- Replaced the ambiguous `us` chart label with the standard microsecond symbol (`µs`).
- Added local Mac setup and validation instructions.
- Clarified that Docker uses a container health check against the main page rather than a separate health endpoint.
- Clarified that the repository contains code, evidence, deployment files, and supporting documentation while the formal Word reports are submitted separately.

## Added

- Integrated interface-to-controller-to-policy-to-result-to-log evidence.
- Requirement-to-test-and-evidence traceability for the Unit 6 results.
- Repeatable performance benchmark with archived text and JSON results.
- Structured six-criterion usability review.
- Docker and Nginx nonproduction deployment configuration.
- Deployment prerequisites, health check, security headers, and rollback guidance.
- Sanitized figures for the interface, representative outputs, decision log, code, automated tests, and evaluation metrics.

## Verified

- 16 of 16 automated tests passed.
- 100 percent line and function coverage.
- 96.97 percent branch coverage.
- Windows, macOS, iOS, and iPadOS sample inputs remain supported by the shared endpoint baseline.

## Boundaries

The evidence was produced with synthetic information in a controlled local environment. The release does not claim a live connection to Entra ID, Intune, Apple Business Manager, Addigy, Microsoft Graph, or a production directory. The included Docker material documents the planned nonproduction deployment method; it does not claim a production deployment.
