# System Requirements

## Functional requirements

| ID | Requirement |
|---|---|
| FR-01 | The system shall authenticate organizational users through the approved cloud identity service. |
| FR-02 | The system shall require MFA for administrators and for access scenarios identified as elevated risk. |
| FR-03 | The system shall enroll representative Windows, macOS, iOS, and iPadOS endpoints through approved methods. |
| FR-04 | The system shall apply platform-appropriate configuration and security policies to enrolled devices. |
| FR-05 | The system shall evaluate device compliance before access to selected organizational resources. |
| FR-06 | The system shall grant administrative capabilities through role-based least-privilege assignments. |
| FR-07 | The system shall record sign-in, policy, enrollment, administrative, and compliance events. |
| FR-08 | The system shall support removal of organizational access and data when a device is lost or a user leaves. |
| FR-09 | The design shall support approved legacy applications during a controlled hybrid transition. |
| FR-10 | The system shall provide understandable access-denial and remediation information to users and support staff. |

## Nonfunctional requirements

| ID | Quality | Requirement |
|---|---|---|
| NFR-01 | Security | Encrypt protected data in transit and at rest; enforce MFA, least privilege, separation of duties, and auditable administration. |
| NFR-02 | Reliability | Preserve required access during pilot and migration; document recovery, rollback, emergency access, and dependency ownership. |
| NFR-03 | Usability | Keep enrollment and MFA steps understandable; provide instructions, support, and accessible alternatives where practical. |
| NFR-04 | Performance | Complete normal cloud authentication and policy evaluation without avoidable delay; measure observed proof-of-concept behavior. |
| NFR-05 | Scalability | Use group-based assignments and reusable policies that can expand beyond representative test devices without individual configuration. |
| NFR-06 | Privacy | Collect only necessary PII, restrict access, explain management capabilities, and define retention and disposal. |
| NFR-07 | Maintainability | Use named policies, documented settings, Git-controlled design files, traceable requirements, and repeatable procedures. |
| NFR-08 | Compatibility | Support the required Windows and Apple platforms and identify any legacy applications that prevent cloud-only operation. |

## Evaluation results

- **Pass:** The expected result was observed and supported by evidence.
- **Partial:** The expected result was partly achieved with a documented limitation.
- **Fail:** The observed result did not satisfy the requirement.
- **Not tested:** A valid test could not be completed because of licensing, equipment, permissions, or time.
