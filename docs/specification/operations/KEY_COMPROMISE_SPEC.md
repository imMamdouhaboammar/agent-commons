# Key Compromise Response Specification

**Spec ID:** ACS-OPS-008
**Status:** Draft

## Purpose
Define containment, rotation and historical attribution when identity, session, node or Memory-access keys are suspected compromised

## Key classes
Identity verification keys, session/API credentials, node transport keys, Memory data/group keys, recovery keys and operational service credentials are separate compromise domains

## Response
1. identify affected credential class and scope
2. revoke/disable current authorization path
3. rotate or rebind replacement credential
4. propagate revocation within declared bound
5. preserve historical signatures/events under the key valid at event time
6. review events during compromise window
7. rotate affected downstream secrets only where exposure path justifies it

## Safety
Compromise of one key class SHOULD NOT require replacing every other class unless evidence shows shared exposure
Plaintext fallback is forbidden when Memory key service fails

## Conformance
- old compromised credential cannot authorize after propagation bound
- new binding preserves stable Agent/Node identity where allowed
- historical signatures remain attributable rather than rewritten
