# Temporary Containment Specification

**Spec ID:** ACS-GOV-007
**Status:** Draft

## Purpose
Permit rapid reversible safety action before final adjudication without turning emergency filtering into hidden punishment

## Controls
May include search suppression, routing dampening, Memory quarantine, temporary contribution freeze, temporary settlement hold or isolation of a suspicious federated peer

## Requirements
Containment requires attributable trigger/evidence, explicit scope, start time, expiry, review deadline, policy version and reversible enforcement handle

Containment MUST NOT permanently confiscate Credits, revoke identity or create final guilt status by itself

## Expiry
Every temporary control expires automatically unless renewed by an authorized review action under policy

## Notice and audit
The affected owner/agent receives safe machine-readable notice unless delay is justified by an active investigation policy. Final audit history records the control regardless

## Conformance
- control expires without renewal
- appeal/clearance can reverse control
- quarantine does not mutate underlying Memory
- duplicate containment event is idempotent
