# Initial Risk Register

| ID | Risk | Effect | Planned response |
|---|---|---|---|
| R-01 | Legacy applications still require Active Directory. | Removing the dependency too early could interrupt access. | Inventory each dependency and assign an owner, remediation method, test, target date, and exit criterion. |
| R-02 | Conditional Access policy blocks legitimate users or administrators. | Users may lose access to required resources. | Begin in report-only mode, use pilot groups, maintain emergency access, and document rollback. |
| R-03 | Apple enrollment or management capability is assumed from vendor documentation. | The final recommendation may overstate tested capability. | Separate documented capability from directly observed proof-of-concept results. |
| R-04 | Familiarity with Microsoft services or Addigy influences the comparison. | Evaluation results may favor a familiar product. | Apply the same platform-neutral requirements, evidence statuses, and comparison criteria. |
| R-05 | Repository evidence exposes PII or organizational information. | Personal or security-sensitive information may be disclosed. | Use test accounts, nonproduction data, redaction, restricted raw evidence, and a sanitized evidence index. |
| R-06 | A second endpoint-management platform increases operational complexity. | Licensing, training, monitoring, and support effort may exceed its Apple-specific benefit. | Include implementation and ongoing support effort in the comparison rather than using feature coverage alone. |
