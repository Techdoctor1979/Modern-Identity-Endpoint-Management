# Unit 7 Docker Deployment and Security Results

## Deployment validation

The nonproduction image built from `deployment/Dockerfile`, started successfully, became healthy, and returned HTTP 200. The response included the configured `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Content-Security-Policy` headers. The container served only the static prototype files and used synthetic inputs.

## Vulnerability remediation

The initial `nginx:1.27-alpine` image scan reported 9 critical and 46 high-severity findings in inherited packages. The base image was changed to `nginx:1.30.6-alpine3.24-slim`. After the first remediated scan retained one high-severity zlib finding, the Dockerfile was updated to apply the available zlib upgrade.

The final Docker Scout scan indexed 26 packages and reported:

| Severity | Findings |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

The final local validation also confirmed a healthy container, HTTP 200, and all four configured response headers. Vulnerability data and packages change over time, so this result applies only to the scanned image at the time of the Unit 7 milestone. Every later build must be rescanned.

## Boundary

This was an executed local nonproduction deployment test, not a production deployment. It did not include TLS termination, secrets, authentication, a backend, a database, external vendor APIs, production monitoring, concurrent load, or organizational approval.
