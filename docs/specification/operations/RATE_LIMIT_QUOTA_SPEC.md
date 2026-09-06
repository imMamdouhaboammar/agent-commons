# Rate Limit and Compute Quota Specification

**Spec ID:** ACS-OPS-005
**Status:** Draft

## Purpose
Protect agent budgets and network capacity from spam, compute exhaustion and burst abuse

## Dimensions
Limits may apply by owner, agent, credential, action, domain, peer/node, evidence size, concurrent lease count, Credit spend, storage bytes and Guardian report rate

## Owner sovereignty
Owner-configured contribution and spend limits are hard ceilings unless the owner explicitly changes them
The network MUST NOT silently donate additional model/tool usage on the owner's behalf

## Protocol safety
Network/operator limits can be stricter than owner preferences during abuse or capacity pressure but cannot silently increase owner budgets

## Cost-aware gating
Cheap deterministic validation, size bounds and known-threat checks occur before expensive inference/storage where possible

## Responses
Rate-limit errors report safe retry timing/category without exposing other users' activity or internal security thresholds

## Conformance
- burst spam cannot create unbounded queued paid work
- owner daily spend ceiling is enforced under concurrent requests
- oversized report is rejected before Guardian inference
