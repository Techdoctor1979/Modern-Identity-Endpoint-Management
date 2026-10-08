# Architecture Decision Log

| ID | Status | Decision | Rationale |
|---|---|---|---|
| ADR-001 | Accepted | Use Microsoft Entra ID as the cloud identity platform. | It supports cloud authentication, MFA, roles, lifecycle controls, and Conditional Access integration. |
| ADR-002 | Accepted | Use Intune as the primary cross-platform endpoint-management platform. | It supports the required Windows and Apple platforms and can provide device-compliance information to Conditional Access. |
| ADR-003 | Deferred | Do not include Addigy as a required baseline component. | No current requirement demonstrates the need for a second MDM platform. Addigy remains a contingency if authorized testing identifies an Apple-specific Intune gap. |
| ADR-004 | Proposed | Retain a controlled temporary hybrid path. | Some applications may still depend on Active Directory. Each dependency needs an owner, remediation plan, test, and exit criterion. |
| ADR-005 | Proposed | Use identity and device signals together for selected access decisions. | A valid credential does not establish that the requesting endpoint meets organizational security requirements. |
| ADR-006 | Proposed | Stage access policies in report-only and pilot modes. | Staged deployment, emergency access, and rollback reduce the risk of interrupting legitimate work. |
| ADR-007 | Proposed | Minimize PII in testing and repository evidence. | Identity and endpoint records can contain names, usernames, device identifiers, IP addresses, sign-in records, and compliance results. |
| ADR-008 | Proposed | Use standards to define outcomes and vendor sources to identify capabilities that require validation. | Standards provide product-neutral security and privacy expectations, while vendor documentation does not independently establish comparative performance in this organization. |
| ADR-009 | Accepted | Use Apple Business Manager with Intune for company-owned Apple devices. | Apple Business Manager provides organizational assignment, automated enrollment, and Apps and Books licensing while Intune remains the MDM platform. |
| ADR-010 | Accepted | Use Docker with Nginx as the planned repeatable nonproduction deployment method. | A versioned image can preserve the reviewed static application and server configuration, include a health check, and retain a prior image for rollback without implying a production deployment. |
| ADR-011 | Accepted | Keep the prototype decision log limited to the current browser session. | Session-only logging supports the demonstration while avoiding persistent storage of sample or future identity and device details before audit, access, and retention requirements are approved. |

The accepted platform decisions establish the working baseline for later authorized testing. Proposed and deferred decisions may change when new evidence is recorded.
