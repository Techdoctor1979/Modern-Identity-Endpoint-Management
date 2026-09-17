# Architecture Overview

The proposed architecture begins with the user and the requested organizational resource. Microsoft Entra ID validates the identity and required authentication method. A Windows or Apple endpoint enrolls through the selected management service and receives the appropriate configuration. The management service returns device inventory and compliance information. Conditional Access evaluates the available identity, application, device, location, and risk signals before granting access, requiring another control, or blocking the request.

Microsoft Intune is the baseline endpoint-management candidate because it can connect compliance results directly to Entra Conditional Access and manage Windows and Apple platforms. Apple Business Manager supports organizational ownership and automated Apple enrollment. Addigy is evaluated against the same Apple enrollment, configuration, compliance, monitoring, recovery, privacy, and support requirements. The evaluation may support Intune alone or a justified combination, but the architecture does not assume the result before testing.

Active Directory synchronization and legacy-resource connections appear as temporary transition paths. Each retained dependency must have an owner, remediation method, test, target date, and exit criterion. Governance, monitoring, privacy, user support, exception review, emergency access, and rollback apply across the design rather than belonging to one product.

The editable architecture is stored in `design/Assignment_Activity_Unit_3_System_Architecture.drawio`, with a PNG preview in the same folder.

## How the design addresses the research gap

The literature does not provide one complete workflow for moving an existing organization from Active Directory to cloud identity while supporting Windows and Apple endpoints. The architecture addresses that operational gap through seven logical modules:

1. Identity and directory integration manages the cloud identity and temporary legacy connection.
2. Authentication and authorization applies MFA, roles, recovery, and access policy.
3. Endpoint enrollment establishes organizational or approved device management.
4. Configuration and compliance measures whether each platform meets the required baseline.
5. Conditional resource access combines identity and device results before access is granted.
6. Monitoring and reporting records the events needed for support, audit, and evaluation.
7. Privacy support and governance limits data collection, controls evidence, and provides human review.

Each module connects to functional and nonfunctional requirements in `docs/requirements.md`. Planned tests in `docs/test-plan.md` will separate vendor-documented capabilities from behavior observed in the proof-of-concept environment.
