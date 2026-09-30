# Unit 5 Core Logic and Unit Testing

## Scope

The Unit 5 implementation separates the prototype's access and endpoint-compliance rules from the browser interface. The rules now reside in `src/unit4-prototype/core-logic.js`, while `app.js` collects browser input and displays the returned decision. This separation allows the same policy functions to be exercised by the interface and by automated tests.

## Core Logic

The identity access function evaluates account status, sign-in risk, device compliance, role, MFA status, and the requested resource. Blocking conditions take precedence. A disabled account, high-risk sign-in, noncompliant device, or unknown device state returns `BLOCK`. If no blocking condition exists, an administrator, medium-risk request, or administrative-portal request without completed MFA returns `REQUIRE MFA`. Requests that satisfy all applicable conditions return `GRANT`.

The endpoint compliance function evaluates enrollment, encryption, screen lock, operating-system support, and update status. An endpoint is `COMPLIANT` only when all five conditions pass. When one or more conditions fail, the function returns `NONCOMPLIANT` and lists each failed condition so the output can guide remediation.

Both functions validate input values before evaluating policy. Unsupported or missing values raise an error instead of producing a misleading decision.

## Test Method

The automated suite uses the built-in Node.js test runner and strict assertions. The tests combine black-box and white-box techniques. Black-box cases compare representative inputs with expected decisions. White-box cases exercise decision branches, including block precedence, each MFA trigger, each device state, multiple compliance failures, and invalid input handling.

The automated tests use `UT-01` through `UT-16` so they remain distinct from the broader proof-of-concept test cases in `docs/test-plan.md`.

| Requirement | Automated tests | Verified prototype behavior |
| --- | --- | --- |
| FR-02 | UT-06 through UT-09 | MFA is required where applicable, while blocking conditions retain priority. |
| FR-04 | UT-11 through UT-15 | The endpoint baseline detects failed safeguards and unsupported values. |
| FR-05 | UT-04 and UT-09 | A noncompliant device returns `BLOCK`. |
| FR-10 | UT-02 and UT-13 | Access and compliance decisions include failure reasons. |
| NFR-07 | UT-01 through UT-16 | The separated functions support repeatable automated testing. |
| NFR-08 | UT-14 | Windows, macOS, iOS, and iPadOS sample inputs use the same baseline. |

Run the suite from `src/unit4-prototype` with:

```text
npm test
```

Run the suite with coverage reporting with:

```text
npm run test:coverage
```

The recorded Unit 5 run completed 16 tests with 16 passes, zero failures, 100 percent line coverage, 96.97 percent branch coverage, and 100 percent function coverage for `core-logic.js`.

## Issue Found and Resolved

The original browser prototype placed policy decisions inside DOM event handlers. This made the logic difficult to test without loading the entire page. It also did not reject an unsupported policy value. The Unit 5 change extracted pure policy functions and added centralized input validation. A boundary test confirmed that an unsupported value now raises a clear error instead of falling through to an unintended result.

## Limitations

This remains a nonproduction proof of concept. It uses sample inputs and does not call Microsoft Entra ID, Microsoft Intune, Apple Business Manager, or a production directory. Intune and Apple Business Manager form the current endpoint-management baseline. Addigy was evaluated as an Apple-focused option but is not required in that baseline. It will be reconsidered only if later authorized testing identifies an Apple requirement that Intune cannot adequately meet. Later validation must compare the prototype decisions with authorized platform observations and documented organizational requirements.
