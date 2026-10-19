# Identity and Endpoint Policy Prototype

This folder contains the nonproduction browser prototype used for the capstone implementation, automated tests, browser validation, performance measurement, and container deployment testing. It uses synthetic inputs and does not connect to Microsoft Entra ID, Microsoft Intune, Apple Business Manager, Addigy, or a production directory.

## Local Mac prerequisites

- Node.js for the automated tests and benchmark
- Python 3 for the local static web server
- Google Chrome or Chromium for the Unit 7 headless system suite
- Docker Desktop for the Unit 7 container build, health, header, browser, and image-security checks

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

Run the 16 policy tests and eight Unit 7 resubmission checks with coverage:

```text
node --test --experimental-test-coverage tests/*.test.js
```

The combined run reports 24 of 24 passes. Coverage for `core-logic.js` remains 100 percent for executable lines and functions and 96.97 percent for branches.

Run the performance benchmark:

```text
node scripts/performance-benchmark.js
```

Run the Unit 7 system, integration, and requirement-based acceptance suite:

```text
node tests/system-tests.js
```

The final system run reports seven passes and one documented failure. AT-03 confirms that the current session-only decision log does not survive a browser refresh. The test remains visible because persistent audit storage requires an approved security, privacy, retention, and recovery design.

Start the local web server and open the prototype:

```text
python3 -m http.server 8765
open http://127.0.0.1:8765
```

Use the interface to review the blocked-access, noncompliant endpoint, iOS or iPadOS, and decision-log workflows. Return to Terminal and press `Control-C` to stop the server.

The `core-logic.js` file is loaded by the browser and imported by the automated tests. It is not opened as a standalone Mac application.

## Executed container validation

The Docker and Nginx files provide the tested nonproduction deployment method used for the Unit 7 resubmission. The local image build, health check, HTTP response, security headers, headless-browser accessibility review, and Docker Scout scan were executed successfully. Run the complete procedure in [Deployment and Configuration Validation](deployment/DEPLOYMENT.md).

The recorded milestone browser run completed 200 identity-access and 200 endpoint-compliance workflows through the running Nginx container. It is a local development result, not production performance evidence. It excludes external services, a backend, database storage, network workloads, and concurrent users.
