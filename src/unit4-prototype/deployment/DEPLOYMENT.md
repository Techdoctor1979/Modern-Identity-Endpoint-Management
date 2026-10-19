# Deployment and Configuration Validation

## Selected approach

The Unit 7 resubmission packages the static demonstration application in an Nginx container. The container provides a repeatable web-server configuration without connecting the prototype to a production identity tenant, endpoint-management service, or database. This procedure was executed locally; it is not a production deployment.

## Prerequisites

- Docker Desktop or another Docker-compatible runtime
- A modern browser
- Local TCP port 8080 or another approved test port
- No production credentials, tenant exports, or personal information

## Build and run

Run these commands from the prototype directory:

```text
docker build -f deployment/Dockerfile -t identity-endpoint-prototype:0.7.1-unit7 .
docker run --rm --name identity-endpoint-prototype -p 8080:80 identity-endpoint-prototype:0.7.1-unit7
```

Open `http://localhost:8080` and verify that both evaluators and the decision log work. In another Terminal window, run:

```text
docker inspect --format '{{.State.Health.Status}}' identity-endpoint-prototype
curl -I http://127.0.0.1:8080/
PROTOTYPE_URL=http://127.0.0.1:8080/ node scripts/container-browser-validation.js
docker scout cves identity-endpoint-prototype:0.7.1-unit7 --only-severity critical,high,medium,low
```

The health result should be `healthy`; the HTTP response should be 200 and include the four configured security headers. The browser script should report seven of seven accessibility checks and 200 samples for each workflow. Performance values vary by computer and run. Docker Scout findings also change as packages and vulnerability data change, so the image must be rescanned before each release. Stop the foreground container with `Control-C`.

The Unit 7 milestone scan indexed 26 packages and reported no vulnerable packages after the Nginx base was changed to `nginx:1.30.6-alpine3.24-slim` and zlib was upgraded. This records one local image at one point in time; it does not guarantee future image security.

## Configuration

The present static prototype does not require runtime secrets or environment variables. Its safe defaults are documented in `deployment/config.example.json`. A future authorized integration could use protected deployment settings such as `APP_ENV`, `LOG_LEVEL`, `ENTRA_TENANT_ID`, and approved service endpoints. Client secrets, access tokens, certificates, and production identifiers must not be stored in the source files or committed to version control.

## Release control and rollback

The build should use a reviewed Git tag and immutable image tag. Automated tests should pass before the image is created. The image should first be deployed to a nonproduction environment, followed by a smoke test and approval. Rollback consists of stopping the new container and starting the last approved image. Configuration, test evidence, image version, and approval status should be recorded with the release.
