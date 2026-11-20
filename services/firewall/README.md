# SIGNOVA Transaction Firewall
A limited, fail-closed transaction inspection prototype. It inspects a proposed transaction against an approved intent and explicit policy. It does not sign, submit, or broadcast transactions.
## Supported transaction shapes
- Native transfers
- ERC-20 transfer(address,uint256)
- ERC-20 approve(address,uint256)
Unsupported transaction shapes return UNKNOWN.
## Inputs
inspectTransaction expects transaction, approvedIntent, and policy.
Policy requires string arrays:
- allowedChainIds
- allowedRecipients
- allowedTokens
- allowedSpenders
The transaction and approved intent are compared across chainId, from, to, value, and data. Additional fields fail closed.
## Decisions
- ALLOW: supported checks passed; this does not guarantee safety.
- REQUIRE_REVIEW: additional review is needed.
- BLOCK: transaction conflicts with approved intent.
- UNKNOWN: input is incomplete, malformed, unsupported, or unverified.
## Limitations
- Not a complete transaction-envelope validator. Nonce, gas, and fee fields are unsupported.
- Sender is compared with the approved intent but is not independently authorized.
- Allowlists are trusted inputs.
- ERC-20 contracts are not independently verified.
- Quai compatibility and deployment are not implemented or verified.
- Inspection does not authorize signing or broadcasting.
## Tests
Run from the repository root:
node --test services/firewall/tests/*.test.js
