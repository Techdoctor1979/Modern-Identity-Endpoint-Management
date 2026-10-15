# Unit 7 Performance Regression Summary

The Unit 7 preparation repeated the same local benchmark method used in Unit 6: 10,000 warm-up evaluations followed by seven trials of 250,000 evaluations for each policy function.

| Function | Unit 6 median | Unit 7 median | Interpretation |
| --- | ---: | ---: | --- |
| Identity access | 0.170 microseconds | 0.176 microseconds | Small variation on a general-purpose local computer |
| Endpoint compliance | 0.213 microseconds | 0.219 microseconds | Small variation on a general-purpose local computer |

The values cover only local JavaScript policy-function execution. They exclude browser rendering, authentication, network latency, vendor services, databases, persistent logging, and concurrent users. They are useful as development regression baselines and are not production-capacity claims.
