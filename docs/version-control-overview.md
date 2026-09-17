# Version Control and Traceability

Git maintains the history of the project documentation, editable architecture, safe proof-of-concept material, and evidence index. GitHub hosts the repository, and GitHub Desktop is the local application used to create commits, switch branches, merge reviewed work, and publish changes.

The `main` branch represents reviewed milestone work. The `development` branch contains work being prepared for the next review. A focused branch may be created from `development` when a design, documentation, or testing change should be reviewed separately. Reviewed focused work returns to `development`, and a completed milestone is merged into `main`.

Descriptive commits record what changed. Requirement identifiers may be included when a change affects a specific requirement, test, risk, or decision. The decision log explains why major architecture choices changed. The evidence index connects a test result to its requirement, date, environment, status, and sanitized file.

The repository excludes credentials, tokens, private keys, production exports, personal information, device serial numbers, tenant identifiers, and unredacted screenshots. This restriction is necessary because Git preserves earlier commits even after a sensitive value is removed from the current file.
