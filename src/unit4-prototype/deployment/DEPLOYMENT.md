# Deployment and Configuration Plan

## Selected approach

The proposed Unit 6 deployment packages the static demonstration application in an Nginx container. The container provides a repeatable web-server configuration without connecting the prototype to a production identity tenant, endpoint-management service, or database.

## Prerequisites

- Docker Desktop or another Docker-compatible runtime
- A modern browser
- Local TCP port 8080 or another approved test port
- No production credentials, tenant exports, or personal information

## Build and run

Run these commands from the prototype directory:

```text
docker build -f deployment/Dockerfile -t identity-endpoint-prototype:0.6.0 .
docker run --rm --name identity-endpoint-prototype -p 8080:80 identity-endpoint-prototype:0.6.0
```

Open `http://localhost:8080` and verify that both evaluators and the decision log work. Stop the container with `Control-C`.

## Configuration

The present static prototype does not require runtime secrets or environment variables. Its safe defaults are documented in `deployment/config.example.json`. A future authorized integration could use protected deployment settings such as `APP_ENV`, `LOG_LEVEL`, `ENTRA_TENANT_ID`, and approved service endpoints. Client secrets, access tokens, certificates, and production identifiers must not be stored in the source files or committed to version control.

## Release control and rollback

The build should use a reviewed Git tag and immutable image tag. Automated tests should pass before the image is created. The image should first be deployed to a nonproduction environment, followed by a smoke test and approval. Rollback consists of stopping the new container and starting the last approved image. Configuration, test evidence, image version, and approval status should be recorded with the release.
