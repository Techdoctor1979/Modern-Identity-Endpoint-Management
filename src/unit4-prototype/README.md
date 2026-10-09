# Identity and Endpoint Policy Prototype

This folder contains the nonproduction browser prototype used for the capstone implementation, automated tests, performance benchmark, and deployment planning. It uses synthetic inputs and does not connect to Microsoft Entra ID, Microsoft Intune, Apple Business Manager, Addigy, or a production directory.

## Local Mac prerequisites

- Node.js for the automated tests and benchmark
- Python 3 for the local static web server
- A modern browser

The prototype uses built-in Node.js features and has no external package dependencies. If Terminal reports that `node` is unavailable, install Node.js before continuing.

## Run and validate locally

Open Terminal in the folder that contains the cloned repository, then enter the prototype folder:

```text
cd Modern-Identity-Endpoint-Management/src/unit4-prototype
```

Confirm the local tools:

```text
node --version
python3 --version
```

Run the 16 automated tests with coverage:

```text
node --test --experimental-test-coverage tests/core-logic.test.js
```

Run the performance benchmark:

```text
node scripts/performance-benchmark.js
```

Start the local web server and open the prototype:

```text
python3 -m http.server 8765
open http://127.0.0.1:8765
```

Use the interface to review the blocked-access, noncompliant endpoint, iOS or iPadOS, and decision-log workflows. Return to Terminal and press `Control-C` to stop the server.

The `core-logic.js` file is loaded by the browser and imported by the automated tests. It is not opened as a standalone Mac application.

## Planned container deployment

The Docker and Nginx files document a planned nonproduction deployment method. Docker execution is not required for the local browser demonstration and is not presented as a completed production deployment. See [Deployment and Configuration Plan](deployment/DEPLOYMENT.md) for the planned build, validation, and rollback steps.
