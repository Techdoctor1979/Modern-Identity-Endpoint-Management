# Unit 5 Core Logic and Testing v0.5.0

## Summary

This milestone separates the identity-access and endpoint-compliance rules from the browser interface so the same logic can be exercised by the prototype and automated tests.

## Included

- Identity-access decisions for `GRANT`, `REQUIRE MFA`, and `BLOCK`
- Endpoint-compliance decisions for Windows, macOS, iOS, and iPadOS sample inputs
- Input validation for missing and unsupported values
- Sixteen automated tests labeled `UT-01` through `UT-16`
- Node.js coverage reporting
- GitHub Actions workflow for pushes and pull requests involving `main` or `development`
- Sanitized screenshots, test output, and a Unit 5 evidence index

## Recorded Results

- 16 tests passed
- 0 tests failed
- 100 percent line coverage for `core-logic.js`
- 96.97 percent branch coverage for `core-logic.js`
- 100 percent function coverage for `core-logic.js`

## Limitations

This is a nonproduction proof of concept that uses sample inputs. It does not connect to Microsoft Entra ID, Microsoft Intune, Apple Business Manager, or a production directory. The current baseline uses Intune with Apple Business Manager for the required Apple-management functions. Addigy remains a contingency rather than a required component. Authorized platform validation remains a later milestone.
