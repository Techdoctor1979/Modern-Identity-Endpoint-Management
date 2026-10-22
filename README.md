# Modernizing Organizational Identity and Endpoint Management

This repository supports an MSIT capstone project that evaluates how an organization can move from traditional on-premises Microsoft Active Directory toward cloud-based identity and endpoint management while continuing to support Windows, macOS, iOS, and iPadOS devices.

The current baseline uses Microsoft Entra ID for identity and access and Microsoft Intune for Windows, macOS, iOS, and iPadOS management. Apple Business Manager provides organizational assignment, automated enrollment, and application licensing for company-owned Apple devices. Addigy was reviewed as an Apple-focused option, but it is not required in the current baseline. I will reconsider it only if later authorized testing identifies an Apple requirement that Intune cannot meet at an acceptable operational or licensing cost.

## Portfolio highlights

- [Final project summary](docs/unit8-final-portfolio.md)
- [System architecture](docs/architecture-overview.md)
- [Working nonproduction prototype](src/unit4-prototype)
- [Final testing and maintenance evidence](docs/unit7-system-testing-maintenance.md)
- [Unit 8 release notes](docs/unit8-release-notes.md)
- [Sanitized evidence index](evidence/evidence-index.md)

[Watch the recorded capstone presentation and live demonstration on ScreenPal](https://go.screenpal.com/watch/cO63ocnyu3W). The recording is hosted externally and is not stored in this repository.

## Research gap and design response

Existing sources provide useful but separate guidance. NIST and CISA describe identity assurance, privacy, and zero-trust outcomes, while Microsoft, Apple, and Addigy document platform capabilities. Standards do not prescribe a complete mixed-platform migration, and vendor documentation does not independently compare the products in this organization.

The proposed system addresses that gap by connecting identity lifecycle, authentication, endpoint enrollment, configuration, compliance, Conditional Access, monitoring, privacy, and legacy transition controls. Standards define the expected security and privacy outcomes. Vendor material identifies capabilities that still require requirements-based review or proof-of-concept testing. See [Research Analysis and Design Response](docs/research-analysis.md) for the detailed connection.

## Project objectives

- Document identity, endpoint, security, privacy, compatibility, support, and cost requirements.
- Define the proposed architecture and the interactions among its components.
- Verify the required Apple-management outcomes through Intune and Apple Business Manager and document any remaining gaps.
- Test representative authentication, enrollment, configuration, compliance, and access scenarios.
- Produce a migration roadmap with dependencies, risks, rollback steps, and hybrid exit criteria.

## Repository structure

| Folder | Purpose |
|---|---|
| `src/` | Nonproduction prototype, automated tests, evaluation scripts, and sanitized deployment configuration. |
| `docs/` | Requirements, module specifications, design decisions, risks, test plans, and progress records. |
| `design/` | Editable Draw.io architecture source and exported preview image. |
| `evidence/` | Anonymized evidence index and guidance for approved screenshots or exports. |

The formal Word assignment documents are submitted separately through the course assignment area and are excluded from this repository.

## Architecture

![Assignment Activity Unit 3 system architecture](design/Assignment_Activity_Unit_3_System_Architecture.png)

The design connects cloud identity, endpoint enrollment, configuration and compliance, Conditional Access, organizational resources, monitoring, privacy, support, recovery, and a controlled temporary path for legacy dependencies.

## Branches

- `main` contains reviewed milestone work.
- `development` contains changes being prepared for review.
- Larger changes may use focused branches created from `development`.

See [Version Control and Traceability](docs/version-control-overview.md) for the working approach.

## Run the prototype

The prototype uses synthetic inputs and has no external JavaScript package dependencies. From `src/unit4-prototype`, run:

```text
node --test tests/*.test.js
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765` in a browser. The complete local, system-test, benchmark, and Docker instructions are in the [prototype run guide](src/unit4-prototype/README.md).

## Current status

The approved capstone prototype and its local evaluation are complete. The combined automated suite passes 26 of 26 checks: 16 policy tests and ten additional input, deployment, security-header, structural, and plain-language checks. Seven of seven structural browser-accessibility checks pass, and seven of eight integrated system and acceptance cases pass. The remaining case intentionally documents that the temporary decision log does not survive a browser refresh and therefore cannot serve as organizational audit evidence.

The tested Nginx container built successfully, became healthy, returned HTTP 200 with the configured security headers, and completed a clean milestone Docker Scout scan after base-image and zlib remediation. A qualitative follow-up with three representative users on October 19, 2026 identified technical terminology as the primary issue for the nontechnical participant. The interface now provides plain-language definitions, result explanations, specific remediation steps, and a visible temporary-log notice.

Unit 8 packages the completed work into a public-safe portfolio summary while keeping formal course submissions, student identifiers, credentials, production information, and unredacted materials out of the repository. The working platform baseline remains Entra ID, Intune, and Apple Business Manager. Persistent audit storage, structured testing with a larger participant group, manual accessibility review, authorized tenant configuration, and vendor-connected testing remain future work.

See [Unit 6 Integration, Evaluation, and Deployment Planning](docs/unit6-integration-evaluation-deployment.md) for the measured results, traceability table, deployment boundary, and limitations. The matching sanitized artifacts are listed in the [Unit 6 Evidence Index](evidence/unit6-evidence-index.md).

See [Unit 7 System Testing and Maintenance Plan](docs/unit7-system-testing-maintenance.md) for the complete browser-test matrix, maintenance schedule, risks, and production-readiness path. The matching artifacts are listed in the [Unit 7 Evidence Index](evidence/unit7-evidence-index.md).

See the [Unit 8 Final Portfolio Summary](docs/unit8-final-portfolio.md) for the final outcome, portfolio map, demonstrated competencies, and production-readiness boundary. The [Unit 8 Evidence Index](evidence/unit8-evidence-index.md) connects the final portfolio to the existing sanitized evidence.

## Security and privacy

Do not commit credentials, access tokens, private keys, production exports, personal information, device serial numbers, tenant identifiers, IP addresses, or unredacted screenshots. Use test accounts, nonproduction data, and sanitized evidence.

## Author

Dennis Morales  
MSIT 5910-01 Capstone Project  
University of the People
