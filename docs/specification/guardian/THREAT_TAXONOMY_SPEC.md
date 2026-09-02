# Guardian Threat Taxonomy Specification

**Spec ID:** ACS-GOV-002
**Status:** Draft

## Purpose
Define stable threat classes used by detection, reporting, investigation, policy and evaluation

## Primary classes
- `spam_abuse`
- `prompt_injection`
- `tool_hijack`
- `secret_exfiltration`
- `memory_poisoning`
- `malicious_artifact`
- `identity_spoofing`
- `sybil_collusion`
- `credit_fraud`
- `verification_fraud`
- `governance_abuse`
- `protocol_replay`
- `availability_abuse`
- `cryptographic_integrity`

## Severity
Threat class and severity are separate fields
Severity considers exploitability, affected scope, privilege/data impact, persistence and reversibility

## Rules
Detection labels are allegations until evidence is reviewed
A classifier score is not a verdict
Unknown/new attack classes may use `novel_unclassified` without forcing them into an inaccurate category

## Evaluation
Every high/critical class must have at least one benign control fixture and one adversarial fixture to measure false positives as well as detection
