import test from "node:test";
import assert from "node:assert/strict";
import { explainInspection } from "../src/explain-inspection.js";
test("explains unlimited approval without changing decision", () => {
  const result = explainInspection({
    decision: "REQUIRE_REVIEW",
    reason: "UNLIMITED_APPROVAL",
    findings: [{ riskCode: "UNLIMITED_APPROVAL" }]
  });
  assert.equal(result.decision, "REQUIRE_REVIEW");
  assert.equal(result.explanations[0].riskCode, "UNLIMITED_APPROVAL");
});
test("preserves BLOCK decision", () => {
  const result = explainInspection({
    decision: "BLOCK",
    reason: "RECIPIENT_MISMATCH",
    findings: [{ riskCode: "RECIPIENT_MISMATCH" }]
  });
  assert.equal(result.decision, "BLOCK");
});
test("preserves UNKNOWN decision", () => {
  const result = explainInspection({
    decision: "UNKNOWN",
    reason: "UNSUPPORTED_SELECTOR",
    findings: []
  });
  assert.equal(result.decision, "UNKNOWN");
  assert.equal(result.explanations[0].riskCode, "UNKNOWN_RISK_CODE");
});
test("handles invalid inspection input", () => {
  const result = explainInspection(null);
  assert.equal(result.decision, "UNKNOWN");
  assert.equal(result.explanations[0].riskCode, "INVALID_FINDING");
});
