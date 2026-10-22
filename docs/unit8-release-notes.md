# Unit 8 Release Notes

## Final portfolio release

Release candidate: `unit-8-final-portfolio-v1.0.0`

Unit 8 packages the completed capstone prototype, design records, and sanitized evaluation evidence into a public-safe portfolio. It does not change the established policy behavior or convert the prototype into a production deployment.

## Added

- Final public portfolio summary and portfolio map.
- Unit 8 evidence index that connects the final outcome to the existing sanitized evidence.
- README portfolio highlights and a concise local run path.
- Final status summary covering automated checks, accessibility, integrated browser testing, container validation, and representative-user feedback.
- Public ScreenPal link for the recorded capstone presentation and live demonstration without committing the MP4 file to the repository.

## Verified

- 26 of 26 combined automated checks passed.
- The 16 policy tests retained 100 percent executable-line and function coverage and 96.97 percent branch coverage.
- Seven of seven structural browser-accessibility checks passed.
- Seven of eight integrated system and acceptance cases passed.
- The Docker and Nginx container built successfully, became healthy, returned HTTP 200, and served the configured security headers.
- The final milestone Docker Scout scan reported no vulnerable packages across the 26 indexed packages.
- The Unit 8 final prototype files match the reviewed prototype already stored in `src/unit4-prototype`.

## Known limitation

The decision log is session-only and clears after a browser refresh. This behavior remains documented instead of being hidden or represented as production audit capability.

## Publication boundary

Formal course submissions, the student identifier, editable presentation files, credentials, production data, confidential organizational information, unredacted screenshots, and the MP4 recording are excluded from the repository. The presentation is hosted through ScreenPal rather than committed into the repository history.
