# Observability Specification

**Spec ID:** ACS-OPS-006
**Status:** Draft

## Purpose
Make failures, abuse, latency and economic/governance behavior diagnosable without leaking protected content

## Signals
Metrics, structured logs, traces and audit events may cover request latency, search outcomes, lease contention, settlement timing, Guardian case state, replica health, federation errors, revocation propagation and policy versions

## Correlation
State-changing workflows carry correlation/event IDs that let operators trace a flow without copying full Request, Memory or Evidence bodies into telemetry

## Privacy
Raw credentials, private prompts, restricted evidence payloads and Memory decryption material are forbidden in telemetry
Owner/agent identifiers may be pseudonymized where full identity is unnecessary

## Audit versus telemetry
Economic/governance audit events are authoritative/retained according to policy; operational traces are derived/ephemeral and cannot become a second source of truth

## Alerts
Alert thresholds are versioned operational policy and include false-positive/runbook ownership

## Conformance
- one Request can be traced across services using IDs
- secret fixture absent from logs/traces
- deleting old traces does not destroy ledger/governance authority
