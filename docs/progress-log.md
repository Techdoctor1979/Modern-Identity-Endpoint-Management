# Project Progress Log

## Assignment Activity Unit 3

Completed work includes the problem definition, literature survey and critical source comparison, stakeholder needs, proposed architecture, seven logical modules, ten functional requirements, eight nonfunctional requirements, initial risk review, GitHub repository structure, and branching approach.

The architecture retains a controlled temporary hybrid path while cloud-only feasibility and Apple-management options remain under evaluation. The Intune and Addigy comparison will use the same requirements and evidence standards. Familiarity with either platform will not be treated as proof that it satisfies a requirement.

The literature analysis now distinguishes product-neutral standards from vendor capability statements. It also maps the identified transition gap to the system modules, requirement identifiers, and planned proof-of-concept evidence.

The next milestone is to validate the requirements, finish the current-state identity and application inventory, prepare the isolated proof-of-concept environment, and test representative authentication, enrollment, configuration, compliance, and Conditional Access scenarios.

## Assignment Activity Unit 4

The browser prototype now accepts sample identity and endpoint information and returns access or compliance decisions. It also records a temporary decision log for the current browser session. The demonstration uses nonproduction information and does not connect to an organizational tenant.

## Assignment Activity Unit 5

I moved the policy rules out of the browser event handlers and into separate JavaScript functions. The automated suite now covers normal decisions, blocking priority, MFA conditions, endpoint failures, unsupported values, and platform inputs. The recorded run completed 16 tests with no failures. Line and function coverage reached 100 percent, and branch coverage reached 96.97 percent.

The current platform baseline uses Microsoft Entra ID, Microsoft Intune, and Apple Business Manager. Addigy was considered because of its Apple-management focus and my prior experience with it, but the current requirements do not justify another MDM platform. I will revisit that decision only if authorized testing identifies an Apple requirement that Intune cannot meet.

## Assignment Activity Unit 6

I connected the browser interface, controller, policy functions, result panels, and temporary decision log into one traceable workflow. The Unit 5 automated suite was rerun as a regression baseline, and all 16 tests passed with 100 percent line and function coverage and 96.97 percent branch coverage.

The Unit 6 evaluation adds a requirement-to-evidence table, a repeatable local benchmark, a performance chart, and a six-criterion usability review. The benchmark is limited to the local JavaScript policy functions and is not presented as production-capacity evidence. The usability review identified remediation guidance and error recovery as the clearest improvement areas.

The proposed nonproduction deployment uses Docker and Nginx so the application files and server configuration can be versioned together. The configuration includes a health check, basic browser-security headers, nonsecret example settings, and rollback guidance. This remains a deployment plan; no production deployment or live vendor integration is claimed.

## Assignment Activity Unit 7

I added a repeatable headless Chrome suite that tests the interface, controller, policy functions, visible results, and session log as one system. The initial run produced six passes and two failures. One failure came from an incorrect assertion that counted the remediation message as if it were a failed condition. After I changed the test to verify the required messages by content, the final run produced seven passes and one failure.

The remaining AT-03 failure is an accepted limitation, not an unexplained defect. The current decision log is stored only in browser memory and does not survive a refresh. Persistent audit storage will require approved fields, access controls, encryption, retention and deletion rules, recovery procedures, and privacy review before implementation.

The Unit 7 package also adds corrective, adaptive, perfective, and preventive maintenance activities; a maintenance schedule; a change-control workflow; post-deployment risks; and production-readiness gates. A later authorized phase would test the baseline in a nonproduction Microsoft tenant with representative Windows and Apple devices before a limited organizational pilot.

On October 19, 2026, I obtained qualitative follow-up feedback from three employees who had participated in earlier prototype testing: a receptionist representing a nontechnical end user, a Level 1 Help Desk technician, and a systems administrator. The receptionist needed additional explanation of identity-access and endpoint-compliance terminology. I added plain-language definitions, everyday-language decision explanations, specific corrective steps for failed device-security conditions, and a visible notice that the decision log is temporary. Ten of ten resubmission validation checks now pass, bringing the combined automated result to 26 of 26. The employees formed a small internal convenience sample. The follow-up did not use a new numerical rating protocol, so I did not calculate a new usability score.

## Current limitations

Available licenses, representative devices, permissions, and Apple enrollment services may limit testing. Any unsupported test will be recorded as `Not tested` with the reason. Repository evidence must remain anonymized and free of credentials, production data, and unnecessary personal information. Later testing should add the remaining branch case, persistent audit storage, manual accessibility review, structured task-based representative-user evaluation with a larger group, end-to-end timing, and authorized platform evidence where access permits.
