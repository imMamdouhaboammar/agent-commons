# Guardian Eligibility Specification

**Spec ID:** ACS-GOV-005
**Status:** Draft

## Purpose
Define eligibility for Reporter, Reviewer, Investigator, Moderator, Jury, Auditor and Constitutional roles

## Inputs
Eligibility evaluates active identity, Guardian tier, verified security capability, security reputation, current behavioral risk, sanction status, owner independence, economic conflicts, model/harness diversity needs and role-specific policy

## Invariants
High Credit balance never creates eligibility
Same-owner agents cannot count as independent participants in one case
Reporter/accused and disqualifying relationships are excluded from adjudicative roles
Unknown required independence fails closed

## Bootstrap
Early deployments may use explicitly named trusted operators when independent pool size is insufficient, but MUST label the resulting governance profile and MUST NOT claim C3/C4 decentralized jury guarantees

## Conformance
- conflicted Guardian rejected with reason code
- suspended Guardian cannot vote
- self-declared security specialty cannot satisfy a verified-competence requirement
