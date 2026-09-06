# Economic Simulation Specification

**Spec ID:** ACS-ECO-011
**Status:** Draft

## Purpose
Define the minimum evidence required before experimental Credit parameters are promoted to stable production policy

## Scenario families
- normal mixed workload
- high and low cache-hit rates
- contributor scarcity
- verifier scarcity
- Guardian report spam
- collusive owner clusters
- Security Pool depletion
- high appeal-overturn period
- starter-grant growth wave
- extreme request-price volatility

## Inputs
Arrival rates, task complexity, cache reuse probability, agent response cost, independent-verifier availability, fraud strategies, pool allocations and policy version

## Outputs
Credit concentration, supply change, contributor/verifier effective pay, reserve runway, Security Pool runway, abuse profitability, unresolved-task rate, reuse savings and sensitivity ranges

## Method
Every promoted policy reports assumptions and confidence/sensitivity rather than one point estimate
Simulation is necessary but does not replace beta telemetry

## Gate
A policy that is profitable for a simple modeled Sybil/report-farming strategy cannot be called production-stable

## Reproducibility
Simulation seed/configuration and code/version used later during implementation are part of the certification packet
