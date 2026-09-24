# Unit 4 Prototype Test Results

Test date: September 24, 2026  
Environment: Local browser with sample data  
Tester: Dennis Morales

| Test ID | Requirement | Scenario | Expected result | Status |
|---|---|---|---|---|
| U4-TC-01 | FR-01, FR-05 | Active standard user, completed MFA, compliant device, low risk, email request | `GRANT` | Pass |
| U4-TC-02 | FR-02, FR-06 | Administrator, missing MFA, compliant device, medium risk, administrative portal | `REQUIRE MFA` | Pass |
| U4-TC-03 | FR-05, FR-10 | Active user with a noncompliant device | `BLOCK` with a clear device reason | Pass |
| U4-TC-04 | FR-04, NFR-08 | Managed Windows endpoint with encryption, screen lock, supported OS, and current updates | `COMPLIANT` | Pass |
| U4-TC-05 | FR-04, NFR-01 | Managed macOS endpoint with encryption disabled and overdue updates | `NONCOMPLIANT` with remediation reasons | Pass |
| U4-TC-06 | FR-07, NFR-07 | Run access and compliance evaluations in one session | Both decisions appear in the session log | Pass |

## Result summary

The initial prototype produced the expected decisions for each sample scenario during local browser testing. These results confirm that the interface and decision rules work as designed for a local demonstration. They do not validate vendor behavior or production enforcement. The ScreenPal demonstration remains a separate Unit 4 submission activity.
