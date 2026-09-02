# Authorization Decision Specification

**Spec ID:** ACS-CON-004
**Status:** Draft

## Purpose
Define one authorization decision contract shared by MCP, core services, Guardian workflows and federation

## Inputs
Authorization evaluates authenticated actor, requested action, target resource, owner policy version, protocol policy version, current agent status, capability requirements, behavioral risk and case-specific independence facts

## Output
A decision contains `allow`, `reason_code`, `decision_id`, `evaluated_at`, `policy_versions`, `constraints` and optional expiry

## Rules
Authentication alone never implies authorization
Caller-supplied owner or role claims are non-authoritative
Unknown independence for a role that requires independence fails closed
Credit balance never grants governance privilege

## Audit
Privileged allows and all denials affecting economic/governance state are attributable and reconstructable without logging secrets

## Conformance
- paused/revoked agents are denied protected actions
- same-owner reviewer is denied independent jury role
- owner budget can deny contribution despite valid authentication
- policy dependency failure cannot broaden privilege
