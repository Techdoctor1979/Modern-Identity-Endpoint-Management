"use strict";

const { performance } = require("node:perf_hooks");
const { evaluateAccess, evaluateCompliance } = require("../core-logic.js");

const ITERATIONS = 250000;
const WARMUP_ITERATIONS = 10000;
const TRIALS = 7;

const accessScenarios = [
  { account: "active", role: "standard", mfa: "complete", device: "compliant", risk: "low", resource: "email" },
  { account: "active", role: "administrator", mfa: "missing", device: "compliant", risk: "low", resource: "admin" },
  { account: "disabled", role: "standard", mfa: "complete", device: "compliant", risk: "low", resource: "files" },
  { account: "active", role: "standard", mfa: "complete", device: "noncompliant", risk: "low", resource: "email" },
  { account: "active", role: "standard", mfa: "missing", device: "compliant", risk: "medium", resource: "files" },
  { account: "active", role: "standard", mfa: "complete", device: "unknown", risk: "high", resource: "admin" }
];

const complianceScenarios = [
  { platform: "Windows", managed: "managed", encryption: "enabled", screenLock: "enabled", os: "supported", updates: "current" },
  { platform: "macOS", managed: "managed", encryption: "disabled", screenLock: "enabled", os: "supported", updates: "overdue" },
  { platform: "iOS", managed: "unmanaged", encryption: "enabled", screenLock: "enabled", os: "supported", updates: "current" },
  { platform: "iPadOS", managed: "managed", encryption: "enabled", screenLock: "disabled", os: "supported", updates: "current" },
  { platform: "Windows", managed: "managed", encryption: "enabled", screenLock: "enabled", os: "unsupported", updates: "overdue" },
  { platform: "macOS", managed: "managed", encryption: "enabled", screenLock: "enabled", os: "supported", updates: "current" }
];

function runIterations(fn, scenarios, iterations) {
  let checksum = 0;
  const start = performance.now();
  for (let index = 0; index < iterations; index += 1) {
    const result = fn(scenarios[index % scenarios.length]);
    checksum += result.decision.length + result.reasons.length;
  }
  const elapsedMs = performance.now() - start;
  return {
    elapsedMs,
    meanLatencyMs: elapsedMs / iterations,
    throughputPerSecond: iterations / (elapsedMs / 1000),
    checksum
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function benchmark(name, fn, scenarios) {
  runIterations(fn, scenarios, WARMUP_ITERATIONS);
  const trials = [];
  for (let trial = 0; trial < TRIALS; trial += 1) {
    trials.push(runIterations(fn, scenarios, ITERATIONS));
  }
  return {
    name,
    scenarios: scenarios.length,
    iterationsPerTrial: ITERATIONS,
    trials: TRIALS,
    medianElapsedMs: median(trials.map((item) => item.elapsedMs)),
    medianLatencyMs: median(trials.map((item) => item.meanLatencyMs)),
    medianThroughputPerSecond: median(trials.map((item) => item.throughputPerSecond)),
    checksum: trials[0].checksum
  };
}

const results = {
  generatedAt: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: process.platform,
    architecture: process.arch
  },
  methodology: {
    warmupIterations: WARMUP_ITERATIONS,
    iterationsPerTrial: ITERATIONS,
    trials: TRIALS,
    reportedStatistic: "median of trial results"
  },
  benchmarks: [
    benchmark("Identity access evaluation", evaluateAccess, accessScenarios),
    benchmark("Endpoint compliance evaluation", evaluateCompliance, complianceScenarios)
  ]
};

console.log("UNIT 6 PERFORMANCE BENCHMARK");
console.log(`Environment: Node ${results.environment.node} on ${results.environment.platform} ${results.environment.architecture}`);
console.log(`Method: ${TRIALS} trials x ${ITERATIONS.toLocaleString()} evaluations after ${WARMUP_ITERATIONS.toLocaleString()} warm-up evaluations`);
results.benchmarks.forEach((item) => {
  console.log("");
  console.log(item.name);
  console.log(`  Median latency: ${item.medianLatencyMs.toFixed(6)} ms per evaluation`);
  console.log(`  Median throughput: ${Math.round(item.medianThroughputPerSecond).toLocaleString()} evaluations per second`);
  console.log(`  Median elapsed time: ${item.medianElapsedMs.toFixed(2)} ms`);
});
console.log("");
console.log("JSON_RESULTS=" + JSON.stringify(results));
