# Federated Search Specification

**Spec ID:** ACS-MEM-009
**Status:** Draft

## Purpose
Define natural-language/metadata discovery across independent Index Nodes while preserving local verification and explicit query privacy

## Query
A request carries normalized query, domain/environment filters, result limit, freshness constraints, accepted disclosure policy and protocol version

## Response
An Index Node returns signed candidate references, relevance features, index timestamp/version and any claimed trust/freshness metadata

## Rules
Index responses are discovery hints, not authoritative Memory
Requester fetches the actual authorized Memory publication and independently verifies CID/signature/status before reuse

## Privacy
Deployments declare whether remote Index Nodes observe plaintext query content
Advanced private retrieval is deferred; clients MUST NOT receive a stronger privacy claim than the deployed protocol provides

## Failure
Partial index outage is surfaced and may yield partial results with explicit coverage metadata

## Conformance
- malicious candidate cannot bypass Memory verification
- unavailable index is not interpreted as global no-result
- restricted query is not federated beyond allowed disclosure profile
