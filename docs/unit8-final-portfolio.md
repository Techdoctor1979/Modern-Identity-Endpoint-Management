# Unit 8 Final Portfolio Summary

## Project outcome

This capstone produced a working nonproduction browser prototype that evaluates identity-access requests and endpoint-compliance conditions through one understandable workflow. It combines synthetic user, authentication, sign-in risk, device, and resource information; returns an explainable decision; and records the result in a temporary session log.

The prototype demonstrates the approved workflow and the controls needed for a later authorized pilot. It is not a live Microsoft Entra ID, Microsoft Intune, Apple Business Manager, Addigy, Microsoft Graph, or production-directory deployment.

## Problem and design response

Organizations may manage user access, Windows devices, and Apple devices through separate tools and procedures. That fragmentation can create repeated work, inconsistent security requirements, and decisions that are difficult for users and support staff to understand.

The project responds with a policy workflow that separates the decision rules from the browser interface. Identity access returns `GRANT`, `REQUIRE MFA`, or `BLOCK`. Endpoint compliance returns `COMPLIANT` or `NONCOMPLIANT`. The shared policy functions support both the browser and the automated tests, which reduces the risk of testing a different copy of the rules.

## Final validation

- 26 of 26 combined automated checks passed.
- The 16 policy tests retained 100 percent executable-line and function coverage and 96.97 percent branch coverage.
- Seven of seven structural browser-accessibility checks passed.
- Seven of eight integrated system and acceptance cases passed.
- The remaining case documents that the temporary decision log clears after a browser refresh.
- The Docker and Nginx image built, became healthy, returned HTTP 200, and included the configured security headers.
- The final milestone Docker Scout scan reported no critical, high, medium, or low findings across the 26 indexed packages after base-image and zlib remediation.
- The containerized browser run completed 200 identity-access and 200 endpoint-compliance evaluations using local synthetic inputs.

The browser timing is a local development measurement. It does not include vendor services, authentication traffic, a backend, database storage, concurrent users, or production monitoring and must not be treated as production-capacity evidence.

## User feedback and accessibility

A follow-up on October 19, 2026 included a receptionist representing a nontechnical user, a Level 1 Help Desk technician, and a systems administrator. The nontechnical participant needed more explanation of identity-access and endpoint-compliance terminology. The interface was updated with plain-language definitions, everyday-language result explanations, specific corrective steps, and a visible notice that the session log is temporary.

This was a small internal convenience sample and did not produce a new numerical usability score. The accessibility checks were structural and do not replace manual keyboard, screen-reader, contrast, or zoom testing.

## Portfolio map

- [Recorded capstone presentation and live demonstration](https://go.screenpal.com/watch/cO63ocnyu3W)
- [Architecture overview](architecture-overview.md)
- [Research analysis and design response](research-analysis.md)
- [Requirements](requirements.md)
- [Module specifications](module-specifications.md)
- [Working prototype and run guide](../src/unit4-prototype/README.md)
- [System testing and maintenance plan](unit7-system-testing-maintenance.md)
- [Decision log](decision-log.md)
- [Risk register](risk-register.md)
- [Final evidence index](../evidence/unit8-evidence-index.md)
- [Source references](references.md)

The formal course report, student identifier, editable presentation files, private submission package, and MP4 recording are intentionally excluded from the public repository. The presentation is hosted externally through the ScreenPal link above.

## Demonstrated competencies

The project demonstrates requirements analysis, standards-based architecture, JavaScript policy design, automated testing, coverage analysis, browser integration, Docker and Nginx deployment, image-vulnerability remediation, version control, CI workflow use, explainable security decisions, accessibility awareness, privacy boundaries, evidence traceability, maintenance planning, and communication for technical and nontechnical audiences.

## Production-readiness boundary

Before a real organizational pilot, the temporary log must be replaced by protected audit storage with approved fields, role-based access, retention and deletion rules, recovery procedures, and privacy review. Later work also requires authorized nonproduction tenant integration, representative device testing, manual accessibility evaluation, structured user testing with a larger group, repeat security scanning, monitoring, rollback validation, licensing review, policy ownership, and support procedures.
