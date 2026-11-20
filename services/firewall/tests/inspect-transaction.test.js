import test from "node:test";
import assert from "node:assert/strict";
import { inspectTransaction } from "../src/inspect-transaction.js";
const SENDER = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const RECIPIENT = "0x2222222222222222222222222222222222222222";
const OTHER_RECIPIENT = "0x3333333333333333333333333333333333333333";
const TOKEN = "0x1111111111111111111111111111111111111111";
const SPENDER = "0x4444444444444444444444444444444444444444";
const POLICY = {
  allowedChainIds: ["1"],
  allowedRecipients: [RECIPIENT],
  allowedTokens: [TOKEN],
  allowedSpenders: [SPENDER]
};
function makeIntent(overrides = {}) {
  return {
    chainId: "1",
    from: SENDER,
    to: RECIPIENT,
    value: "100",
    data: "0x",
    ...overrides
  };
}
function inspect(transaction, approvedIntent = transaction, policy = POLICY) {
  return inspectTransaction({
    transaction,
    approvedIntent,
    policy
  });
}
const addressWord = SPENDER.slice(2).padStart(64, "0");
const amountWord = (100n).toString(16).padStart(64, "0");
const maxAmountWord = ((2n ** 256n) - 1n).toString(16).padStart(64, "0");
test("allows a matching native transfer under explicit policy", () => {
  const intent = makeIntent();
  const result = inspect(intent);
  assert.equal(result.decision, "ALLOW");
  assert.equal(result.reason, "NO_KNOWN_POLICY_VIOLATION");
});
test("blocks a changed recipient", () => {
  const approved = makeIntent();
  const transaction = makeIntent({ to: OTHER_RECIPIENT });
  const result = inspect(transaction, approved);
  assert.equal(result.decision, "BLOCK");
  assert.equal(result.reason, "APPROVED_INTENT_MISMATCH");
  assert.ok(result.mismatchedFields.includes("to"));
});
test("blocks a changed native amount", () => {
  const approved = makeIntent();
  const transaction = makeIntent({ value: "200" });
  const result = inspect(transaction, approved);
  assert.equal(result.decision, "BLOCK");
  assert.ok(result.mismatchedFields.includes("value"));
});
test("returns UNKNOWN for unsupported nonce fields", () => {
  const intent = makeIntent({ nonce: "7" });
  const result = inspect(intent);
  assert.equal(result.decision, "UNKNOWN");
  assert.equal(result.reason, "UNSUPPORTED_TRANSACTION_FIELDS");
});
test("returns UNKNOWN for an untrusted chain", () => {
  const intent = makeIntent({ chainId: "999" });
  const result = inspect(intent);
  assert.equal(result.decision, "UNKNOWN");
  assert.equal(result.reason, "UNSUPPORTED_OR_UNTRUSTED_CHAIN");
});
test("returns UNKNOWN for an unverified token contract", () => {
  const intent = makeIntent({
    to: TOKEN,
    value: "0",
    data: `0xa9059cbb${addressWord}${amountWord}`
  });
  const result = inspect(intent, intent, {
    ...POLICY,
    allowedTokens: []
  });
  assert.equal(result.decision, "UNKNOWN");
  assert.equal(result.reason, "UNVERIFIED_TOKEN_CONTRACT");
});
test("requires review for unlimited ERC20 approval", () => {
  const intent = makeIntent({
    to: TOKEN,
    value: "0",
    data: `0x095ea7b3${addressWord}${maxAmountWord}`
  });
  const result = inspect(intent);
  assert.equal(result.decision, "REQUIRE_REVIEW");
  assert.equal(result.reason, "UNLIMITED_APPROVAL");
});
test("returns UNKNOWN for null input", () => {
  const result = inspectTransaction(null);
  assert.equal(result.decision, "UNKNOWN");
  assert.equal(result.reason, "INVALID_INSPECTION_INPUT");
});
test("returns UNKNOWN when policy is incomplete", () => {
  const intent = makeIntent();
  const result = inspect(intent, intent, {});
  assert.equal(result.decision, "UNKNOWN");
  assert.equal(result.reason, "INCOMPLETE_POLICY");
});
