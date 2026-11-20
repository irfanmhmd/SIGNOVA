
import test from "node:test";
import assert from "node:assert/strict";

import {
  explainFinding,
  RISK_CATALOG
} from "../src/index.js";

// Test all 10 catalogue entries
for (const [riskCode, expected] of Object.entries(RISK_CATALOG)) {
  test(`Explains ${riskCode} correctly`, () => {
    const result = explainFinding({ riskCode });

    assert.equal(result.riskCode, riskCode);
    assert.equal(result.severity, expected.severity);
    assert.equal(result.title, expected.title);
    assert.equal(result.explanation, expected.explanation);
    assert.equal(
      result.recommendedAction,
      expected.recommendedAction
    );
    assert.equal(result.source, "deterministic_rule");
  });
}

// Test unknown risk code
test("Handles unknown risk code safely", () => {
  const result = explainFinding({
    riskCode: "FAKE_RISK"
  });

  assert.equal(result.riskCode, "UNKNOWN_RISK_CODE");
  assert.equal(result.severity, "high");
});

// Test missing risk code
test("Handles missing risk code", () => {
  const result = explainFinding({});

  assert.equal(result.riskCode, "INVALID_FINDING");
});

// Test empty object
test("Handles empty object without crashing", () => {
  assert.doesNotThrow(() => explainFinding({}));
});

// Test null input
test("Handles null input", () => {
  const result = explainFinding(null);

  assert.equal(result.riskCode, "INVALID_FINDING");
});

// Test deterministic output
test("Returns the same output for repeated input", () => {
  const finding = {
    riskCode: "RECIPIENT_MISMATCH"
  };

  const first = explainFinding(finding);
  const second = explainFinding(finding);

  assert.deepEqual(first, second);
});
