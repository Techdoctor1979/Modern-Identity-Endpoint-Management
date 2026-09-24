# Unit 4 Initial Implementation

## Purpose

The Unit 4 prototype converts the Unit 3 architecture into a small working model. It demonstrates how identity conditions and endpoint conditions can produce access and compliance decisions. The prototype uses sample information and does not connect to a production directory, Microsoft Entra ID, Microsoft Intune, Apple Business Manager, or Addigy.

## Development environment

- Browser-based HTML, CSS, and JavaScript prototype
- No external frameworks or package installation
- Source location: `src/unit4-prototype/`
- Version control: GitHub using the existing `development` and `main` branches

To run the prototype, open `src/unit4-prototype/index.html` in a current browser. An optional local web server may also be used, but no database or cloud connection is required.

## Working features

### Identity access evaluation

The evaluator accepts an account state, user role, MFA state, device-compliance state, sign-in risk, and requested resource. It returns one of three results:

- `GRANT` when the evaluated conditions meet the prototype policy.
- `REQUIRE MFA` when an elevated request needs another authentication step.
- `BLOCK` when the account, risk, or device condition does not meet the access baseline.

This feature represents Modules M2 and M5 and supports FR-01, FR-02, FR-05, FR-06, and FR-10.

### Endpoint compliance evaluation

The evaluator accepts a platform, management state, encryption state, screen-lock state, operating-system support state, and security-update state. It returns `COMPLIANT` or `NONCOMPLIANT` and lists the reason for any failure.

This feature represents Modules M3 and M4 and supports FR-03, FR-04, FR-05, NFR-01, and NFR-08.

### Decision log

The log records each decision made during the current browser session. It demonstrates the design requirement for understandable results and traceable testing without storing personal information.

## Architecture connection

The prototype keeps access evaluation separate from endpoint evaluation. This follows the Unit 3 modular design. In the target architecture, Microsoft Entra ID would handle authentication, an endpoint-management service would report compliance, and Conditional Access would combine those signals before access to an organizational resource. The prototype models the decision flow while avoiding production data and credentials.

## Security and privacy safeguards

- The prototype uses sample values rather than employee information.
- It stores no credentials, tokens, tenant identifiers, or device identifiers.
- It sends no information across the network.
- The session log exists only in the current browser page and clears when the page closes or reloads.
- The interface clearly labels the system as a nonproduction proof of concept.

## Current limitations

The prototype does not perform real authentication, enroll devices, call vendor APIs, or enforce a production policy. Those functions require a licensed test tenant, approved accounts, representative devices, and administrative permissions. Future work can replace the sample inputs with sanitized results from an authorized nonproduction environment.
