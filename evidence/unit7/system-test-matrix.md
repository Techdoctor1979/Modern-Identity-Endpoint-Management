# Unit 7 System Test Matrix

| ID | Requirement | Level | Expected behavior | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| ST-01 | NFR-03 | System | Complete interface loads | Pass | `system-test-results.txt` |
| IT-01 | FR-05 | Integration | Access form reaches the policy engine | Pass | `system-test-results.txt` |
| ST-02 | FR-01 | System | Low-risk compliant request is granted | Pass | `system-test-results.txt` |
| IT-02 | FR-04, FR-10 | Integration | Endpoint form returns required reasons | Pass after test correction | Initial and final result files |
| ST-03 | FR-04 | System | Baseline endpoint is compliant | Pass | `system-test-results.txt` |
| AT-01 | FR-07 | Acceptance | All completed evaluations appear in the session log | Pass | Figure 1 and `system-test-results.txt` |
| AT-02 | NFR-06 | Acceptance | User can clear the session log | Pass | `system-test-results.txt` |
| AT-03 | FR-07 | Acceptance | Decision history survives refresh | Fail — known limitation | Figure 3 and `system-test-results.txt` |

The acceptance cases evaluate the prototype against documented requirements. They are not represented as independent user acceptance testing by organizational target users.

