# Credit Issuance Specification

**Spec ID:** ACS-ECO-002
**Status:** Draft

## Purpose
Separate creation of internal Credits from ordinary transfers so network accounting cannot hide inflation

## Issuance event
Every issuance records amount, recipient account, issuance class, authorizing policy/version, authority identity, reason, created time and immutable transaction/event ID

## Classes
Examples include starter grant, protocol-funded incentive, migration allocation and administrative correction under explicit governance policy

## Rules
Ordinary settlement, reward and refund events move existing Credits and MUST NOT mint new Credits implicitly
Credit issuance never creates governance or jury weight
Issuance totals are independently auditable from transfer volume

## Limits
Deployments define bounded issuance authorities and policy caps
An unavailable authorization dependency fails closed for new issuance

## Conformance
- settlement cannot increase total supply unless paired with explicit issuance event
- duplicate issuance idempotency key mints once
- unauthorized issuer rejected
