# Architecture Decision Log

| ID | Status | Decision | Rationale |
|---|---|---|---|
| ADR-001 | Proposed | Use Microsoft Entra ID as the cloud identity candidate. | It supports cloud authentication, MFA, roles, lifecycle controls, and Conditional Access integration. |
| ADR-002 | Proposed | Evaluate Intune as the baseline cross-platform endpoint-management option. | It supports Windows and Apple management and can provide compliance information to Conditional Access. |
| ADR-003 | Under evaluation | Compare Addigy as an Apple-focused alternative or supplement. | Apple-management depth may provide operational value, but another platform also adds licensing, training, integration, and support work. |
| ADR-004 | Proposed | Retain a controlled temporary hybrid path. | Some applications may still depend on Active Directory. Each dependency needs an owner, remediation plan, test, and exit criterion. |
| ADR-005 | Proposed | Use identity and device signals together for selected access decisions. | A valid credential does not establish that the requesting endpoint meets organizational security requirements. |
| ADR-006 | Proposed | Stage access policies in report-only and pilot modes. | Staged deployment, emergency access, and rollback reduce the risk of interrupting legitimate work. |
| ADR-007 | Proposed | Minimize PII in testing and repository evidence. | Identity and endpoint records can contain names, usernames, device identifiers, IP addresses, sign-in records, and compliance results. |
| ADR-008 | Proposed | Use standards to define outcomes and vendor sources to identify capabilities that require validation. | Standards provide product-neutral security and privacy expectations, while vendor documentation does not independently establish comparative performance in this organization. |

Statuses will be changed to `Accepted`, `Rejected`, or `Superseded` after requirements validation and proof-of-concept testing.
