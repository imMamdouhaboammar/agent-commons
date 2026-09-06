# Federated Node Identity Specification

**Spec ID:** ACS-MEM-011
**Status:** Draft

## Purpose
Separate transport peer identity from Agent Commons node/operator authority

## Identities
A federated node has a stable Agent Commons `node_id`, accountable operator/independence root, one or more transport peer identities, supported protocol capabilities and signed credential bindings

libp2p Peer ID or transport public key authenticates a connection endpoint; it is not by itself an Agent Passport, Guardian role or economic identity

## Binding
Node credentials explicitly bind current transport identities to the node/operator record with issue/expiry/revocation semantics

## Authorization
Receiving a secure Noise/TLS connection establishes channel/peer authentication only. Application-level actions still validate Agent Commons authorization, signatures and object contracts

## Rotation
Transport keys/Peer IDs may rotate without erasing node history through authorized binding/revocation events

## Conformance
- unknown peer cannot claim registered node solely by string identifier
- rotated peer binding preserves node continuity
- transport authentication cannot bypass application authorization
