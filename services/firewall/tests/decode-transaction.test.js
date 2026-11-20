import test from "node:test";
import assert from "node:assert/strict";
import { decodeTransaction } from "../src/decode-transaction.js";
const TOKEN = "0x1111111111111111111111111111111111111111";
const RECIPIENT = "0x2222222222222222222222222222222222222222";
const addressWord = RECIPIENT.slice(2).padStart(64, "0");
const amountWord = (100n).toString(16).padStart(64, "0");
test("decodes a native transfer", () => {
  const result = decodeTransaction({
    to: RECIPIENT,
    value: "100",
    data: "0x"
  });
  assert.equal(result.status, "DECODED");
  assert.equal(result.operation, "NATIVE_TRANSFER");
  assert.equal(result.value, 100n);
});
test("decodes an ERC20 transfer", () => {
  const result = decodeTransaction({
    to: TOKEN,
    value: "0",
    data: `0xa9059cbb${addressWord}${amountWord}`
  });
  assert.equal(result.status, "DECODED");
  assert.equal(result.operation, "ERC20_TRANSFER");
  assert.equal(result.spenderOrRecipient, RECIPIENT);
  assert.equal(result.amount, 100n);
});
test("decodes an ERC20 approval", () => {
  const result = decodeTransaction({
    to: TOKEN,
    value: "0",
    data: `0x095ea7b3${addressWord}${amountWord}`
  });
  assert.equal(result.status, "DECODED");
  assert.equal(result.operation, "ERC20_APPROVE");
});
test("rejects malformed calldata", () => {
  const result = decodeTransaction({
    to: TOKEN,
    value: "0",
    data: "0xa9059cbb1234"
  });
  assert.equal(result.status, "UNKNOWN");
});
test("rejects unsupported selectors", () => {
  const result = decodeTransaction({
    to: TOKEN,
    value: "0",
    data: "0xdeadbeef"
  });
  assert.equal(result.status, "UNKNOWN");
  assert.equal(result.reason, "UNSUPPORTED_SELECTOR");
});
test("rejects ERC20 calls carrying native value", () => {
  const result = decodeTransaction({
    to: TOKEN,
    value: "1",
    data: `0xa9059cbb${addressWord}${amountWord}`
  });
  assert.equal(result.status, "UNKNOWN");
  assert.equal(result.reason, "UNEXPECTED_NATIVE_VALUE");
});
test("rejects invalid native recipient", () => {
  const result = decodeTransaction({
    to: "invalid",
    value: "100",
    data: "0x"
  });
  assert.equal(result.status, "UNKNOWN");
});
test("rejects invalid transaction input", () => {
  assert.equal(
    decodeTransaction(null).status,
    "UNKNOWN"
  );
});
