# Unit 7 Performance Regression Summary

The Unit 7 preparation repeated the same local benchmark method used in Unit 6: 10,000 warm-up evaluations followed by seven trials of 250,000 evaluations for each policy function.

| Function | Unit 6 median | Unit 7 median | Interpretation |
| --- | ---: | ---: | --- |
| Identity access | 0.170 microseconds | 0.176 microseconds | Small variation on a general-purpose local computer |
| Endpoint compliance | 0.213 microseconds | 0.219 microseconds | Small variation on a general-purpose local computer |

The values cover only local JavaScript policy-function execution. They exclude browser rendering, authentication, network latency, vendor services, databases, persistent logging, and concurrent users. They are useful as development regression baselines and are not production-capacity claims.

## Containerized browser workflow

The Unit 7 resubmission added a separate headless-browser measurement through the running Nginx container. The recorded milestone run used 200 identity-access submissions and 200 endpoint-compliance submissions.

| Workflow | p50 | p95 | p99 | Maximum |
| --- | ---: | ---: | ---: | ---: |
| Identity access | 0.500 ms | 0.800 ms | 1.100 ms | 2.400 ms |
| Endpoint compliance | 0.500 ms | 0.800 ms | 1.000 ms | 1.000 ms |

These values include the local Chrome DevTools round trip, browser form submission, policy decision, and result rendering after the page was loaded from the container. They still exclude authentication, external network calls, vendor services, backend processing, database storage, persistent audit writes, and concurrent users. They are a more representative local development baseline than the policy-function timing alone, but they are not production performance results. Repeated runs will vary with the computer, browser, and background workload.
