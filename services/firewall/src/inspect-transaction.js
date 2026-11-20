import { decodeTransaction } from "./decode-transaction.js";
import {
  DECISIONS,
  RISK_CODES
} from "./risk-rules.js";
function normalizeAddress(value) {
  if (
    typeof value !== "string" ||
    !/^0x[0-9a-fA-F]{40}$/.test(value)
  ) {
    return null;
  }
  return value.toLowerCase();
}
function normalizeInteger(value) {
  if (
    typeof value !== "string" ||
    !/^(0|[1-9][0-9]*)$/.test(value)
  ) {
    return null;
  }
  return value;
}
function normalizeData(value) {
  if (
    typeof value !== "string" ||
    !/^0x(?:[0-9a-fA-F]{2})*$/.test(value)
  ) {
    return null;
  }
  return value.toLowerCase();
}
function unknown(reason) {
  return {
    decision: DECISIONS.UNKNOWN,
    reason,
    findings: []
  };
}
function block(reason, fields = []) {
  return {
    decision: DECISIONS.BLOCK,
    reason,
    mismatchedFields: fields,
    findings: []
  };
}
function isAllowed(list, value) {
  return list.includes(value);
}
export function inspectTransaction(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return unknown("INVALID_INSPECTION_INPUT");
  }
  const { transaction, approvedIntent, policy } = input;
  if (
    !transaction ||
    typeof transaction !== "object" ||
    Array.isArray(transaction) ||
    !approvedIntent ||
    typeof approvedIntent !== "object" ||
    Array.isArray(approvedIntent) ||
    !policy ||
    typeof policy !== "object" ||
    Array.isArray(policy)
  ) {
    return unknown("INVALID_INSPECTION_INPUT");
  }
  const requiredPolicyLists = [
    "allowedChainIds",
    "allowedRecipients",
    "allowedTokens",
    "allowedSpenders"
  ];
  for (const key of requiredPolicyLists) {
    if (
      !Array.isArray(policy[key]) ||
      !policy[key].every(value => typeof value === "string")
    ) {
      return unknown("INCOMPLETE_POLICY");
    }
  }
  const supportedFields = new Set([
    "chainId",
    "from",
    "to",
    "value",
    "data"
  ]);
  for (const candidate of [transaction, approvedIntent]) {
    if (Object.keys(candidate).some(
      key => !supportedFields.has(key)
    )) {
      return unknown("UNSUPPORTED_TRANSACTION_FIELDS");
    }
  }
  const actual = {
    chainId: normalizeInteger(
      String(transaction.chainId ?? "")
    ),
    from: normalizeAddress(transaction.from),
    to: normalizeAddress(transaction.to),
    value: normalizeInteger(transaction.value ?? "0"),
    data: normalizeData(transaction.data ?? "0x")
  };
  const approved = {
    chainId: normalizeInteger(
      String(approvedIntent.chainId ?? "")
    ),
    from: normalizeAddress(approvedIntent.from),
    to: normalizeAddress(approvedIntent.to),
    value: normalizeInteger(approvedIntent.value ?? "0"),
    data: normalizeData(approvedIntent.data ?? "0x")
  };
  if (
    Object.values(actual).some(value => value === null) ||
    Object.values(approved).some(value => value === null)
  ) {
    return unknown("INVALID_OR_INCOMPLETE_TRANSACTION_INTENT");
  }
  const mismatchedFields = Object.keys(actual).filter(
    key => actual[key] !== approved[key]
  );
  if (mismatchedFields.length > 0) {
    return block("APPROVED_INTENT_MISMATCH", mismatchedFields);
  }
  const decoded = decodeTransaction({
    to: transaction.to,
    value: transaction.value ?? "0",
    data: transaction.data ?? "0x"
  });
  if (decoded.status !== "DECODED") {
    return unknown(decoded.reason);
  }
  const allowedChainIds = policy.allowedChainIds.map(
    value => normalizeInteger(value)
  );
  if (
    allowedChainIds.some(value => value === null) ||
    !isAllowed(allowedChainIds, actual.chainId)
  ) {
    return unknown("UNSUPPORTED_OR_UNTRUSTED_CHAIN");
  }
  const allowedRecipients = policy.allowedRecipients.map(
    normalizeAddress
  );
  const allowedTokens = policy.allowedTokens.map(
    normalizeAddress
  );
  const allowedSpenders = policy.allowedSpenders.map(
    normalizeAddress
  );
  if (
    allowedRecipients.some(value => value === null) ||
    allowedTokens.some(value => value === null) ||
    allowedSpenders.some(value => value === null)
  ) {
    return unknown("INVALID_POLICY_ADDRESS");
  }
  if (decoded.operation === "NATIVE_TRANSFER") {
    if (!isAllowed(allowedRecipients, decoded.to)) {
      return {
        decision: DECISIONS.REQUIRE_REVIEW,
        reason: "RECIPIENT_NOT_ALLOWLISTED",
        findings: []
      };
    }
  } else {
    if (!isAllowed(allowedTokens, decoded.token)) {
      return unknown("UNVERIFIED_TOKEN_CONTRACT");
    }
    if (decoded.operation === "ERC20_TRANSFER") {
      if (
        !isAllowed(
          allowedRecipients,
          decoded.spenderOrRecipient
        )
      ) {
        return {
          decision: DECISIONS.REQUIRE_REVIEW,
          reason: "RECIPIENT_NOT_ALLOWLISTED",
          findings: []
        };
      }
    } else if (decoded.operation === "ERC20_APPROVE") {
      if (decoded.amount === (2n ** 256n) - 1n) {
        return {
          decision: DECISIONS.REQUIRE_REVIEW,
          reason: "UNLIMITED_APPROVAL",
          findings: [{
            riskCode: RISK_CODES.UNLIMITED_APPROVAL,
            decision: DECISIONS.REQUIRE_REVIEW
          }]
        };
      }
      if (
        !isAllowed(
          allowedSpenders,
          decoded.spenderOrRecipient
        )
      ) {
        return {
          decision: DECISIONS.REQUIRE_REVIEW,
          reason: "UNKNOWN_SPENDER",
          findings: [{
            riskCode: RISK_CODES.UNKNOWN_SPENDER,
            decision: DECISIONS.REQUIRE_REVIEW
          }]
        };
      }
    } else {
      return unknown("UNSUPPORTED_OPERATION");
    }
  }
  return {
    decision: DECISIONS.ALLOW,
    reason: "NO_KNOWN_POLICY_VIOLATION",
    findings: [{
      riskCode: RISK_CODES.NO_KNOWN_POLICY_VIOLATION,
      decision: DECISIONS.ALLOW
    }],
    decoded
  };
}
