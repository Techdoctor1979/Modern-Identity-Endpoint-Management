# Proof of Concept Test Plan

Testing will use nonproduction accounts, representative devices, staged policies, and sanitized evidence. A test result will be recorded as `Pass`, `Partial`, `Fail`, or `Not tested` according to `requirements.md`.

| Test ID | Related requirement | Scenario | Expected evidence |
|---|---|---|---|
| TC-01 | FR-01 | Authenticate a test user through the cloud identity service. | Redacted sign-in record and result summary. |
| TC-02 | FR-02, NFR-01 | Require MFA for an administrative or elevated-risk scenario. | Redacted policy and authentication result. |
| TC-03 | FR-03, NFR-08 | Enroll a representative Windows device. | Sanitized enrollment and inventory record. |
| TC-04 | FR-03, NFR-08 | Enroll a representative Apple device where access permits. | Sanitized enrollment and ownership record. |
| TC-05 | FR-04 | Apply a platform-appropriate configuration or security baseline. | Configuration status and limited screenshot or export. |
| TC-06 | FR-05 | Evaluate device compliance before access to a selected resource. | Compliance result and Conditional Access decision. |
| TC-07 | FR-07, NFR-07 | Locate related sign-in, enrollment, policy, and administrative events. | Redacted log references and evidence index entries. |
| TC-08 | FR-08, NFR-02 | Disable a test identity or retire a test device and confirm access removal. | Lifecycle result, recovery notes, and rollback record. |
| TC-09 | FR-10, NFR-03 | Review access-denial and remediation information. | User-facing message and support procedure review. |

Each test record must identify the date, environment, tester, expected result, observed result, evidence location, limitation, and final status.

## Unit-Level Automated Tests

The Unit 5 policy module uses `UT-01` through `UT-16` for isolated automated tests. These unit-test identifiers are documented in `unit5-core-logic-and-testing.md` and do not replace the broader `TC-01` through `TC-09` proof-of-concept test cases above.

## Unit 6 Integration and Evaluation Checks

The Unit 6 checks connect the inherited automated tests to the integrated browser workflow and evaluation evidence. They use synthetic information in the controlled local environment.

| Check ID | Related requirement | Procedure | Recorded result |
| --- | --- | --- | --- |
| U6-IT-01 | FR-05, FR-10 | Submit an elevated access request from a noncompliant sample device. | `BLOCK` is displayed with the device-compliance reason. |
| U6-IT-02 | FR-04, FR-10 | Submit a managed macOS sample with encryption disabled and updates overdue. | `NONCOMPLIANT` is displayed with both failed conditions. |
| U6-IT-03 | FR-07, NFR-07 | Run the access and compliance scenarios in one browser session. | Both results appear in the temporary decision log. |
| U6-EV-01 | NFR-07 | Rerun UT-01 through UT-16 with coverage reporting. | 16 passed; 100% line and function coverage; 96.97% branch coverage. |
| U6-EV-02 | NFR-04 | Run seven benchmark trials of 250,000 evaluations per policy function after warm-up. | Local latency and throughput baseline recorded. |
| U6-EV-03 | NFR-03 | Review six interface-usability and clarity criteria. | Mean 4.67/5; remediation and error recovery identified for improvement. |

These results verify the local prototype only. They do not replace later authorized testing of live authentication, enrollment, compliance, Conditional Access, Microsoft Graph, or Apple Business Manager behavior.

## Unit 7 System, Integration, and Acceptance Tests

The Unit 7 browser suite uses Google Chrome in headless mode to exercise the complete local interface with synthetic values. The acceptance cases evaluate the prototype against the documented requirements; they are not independent user acceptance testing by organizational target users.

| Test ID | Related requirement | Level | Procedure | Final result |
| --- | --- | --- | --- | --- |
| ST-01 | NFR-03 | System | Load the complete prototype interface. | Pass |
| IT-01 | FR-05 | Integration | Submit a blocked access request through the interface and controller. | Pass |
| ST-02 | FR-01 | System | Submit a low-risk compliant access request. | Pass |
| IT-02 | FR-04, FR-10 | Integration | Submit a noncompliant endpoint and verify the required failure reasons. | Pass after correcting the test assertion |
| ST-03 | FR-04 | System | Submit an endpoint that satisfies every baseline check. | Pass |
| AT-01 | FR-07 | Acceptance | Confirm that all four completed evaluations appear in the session log. | Pass |
| AT-02 | NFR-06 | Acceptance | Clear the session log. | Pass |
| AT-03 | FR-07 | Acceptance | Refresh the browser and check whether the decision history remains. | Fail — known limitation |

The initial run produced six passes and two failures. IT-02 was corrected because the application returned the two expected failed conditions plus a separate remediation message. The final run produced seven passes and one failure. AT-03 remains open because the current log is intentionally session-only and does not satisfy a persistent event-recording requirement.

## Control Effectiveness Review

After the pilot, the review will consider whether the security and privacy controls work as intended without creating unnecessary problems for users or support staff.

- Security operation: Review MFA registration and sign-in success, device-compliance results, enrollment failures, Conditional Access decisions, approved exceptions, and policy-related lockouts.
- User impact: Review help-desk requests, repeated access denials, remediation results, and other signs that a control may be difficult to use or support.
- Privacy: Confirm that only necessary identity and device information is collected, access is restricted, retention requirements are followed, and users receive clear notice about device management.

The findings will be recorded with the related requirement and test evidence so that controls can be adjusted before wider deployment.
