# Unit 7 Evidence Index

| Evidence | Purpose |
| --- | --- |
| `Figure_1_Integrated_Decision_Log_After_System_Tests.png` | Shows the four completed identity-access and endpoint-compliance evaluations recorded through the interface. |
| `Figure_2_Initial_System_Test_Output.png` | Shows the initial six passes and two failures, including the incorrect IT-02 assertion and valid AT-03 limitation. |
| `Figure_3_Final_System_Test_Output.png` | Shows the corrected seven passes and the remaining refresh-persistence limitation. |
| `Figure_4_Requirement_Traced_System_Test_Assertions.png` | Shows the exact IT-02 content checks and AT-03 refresh-persistence assertion used by the executable browser suite. |
| `system-test-initial-results.txt` | Preserves the initial output before correcting the IT-02 assertion. |
| `system-test-results.txt` | Preserves the final requirement-traced system-test output. |
| `unit-test-results.txt` | Records the 16-test regression run and coverage summary. |
| `system-test-matrix.md` | Connects each system, integration, and acceptance case to its requirement and result. |
| `performance-regression-summary.md` | Compares the Unit 7 local rerun with the Unit 6 development baseline and states the measurement boundary. |

The matching executable browser suite is `src/unit4-prototype/tests/system-tests.js`. The maintenance strategy, schedule, risks, and production-readiness gates are documented in `docs/unit7-system-testing-maintenance.md`.

All inputs are synthetic. The evidence contains no credentials, access tokens, tenant identifiers, personal information, device serial numbers, production exports, or private network details.
