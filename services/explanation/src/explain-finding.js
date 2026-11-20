import { RISK_CATALOG } from "./risk-catalog.js";

export function explainFinding(finding) {
  // 1. Validate the incoming finding
  if (
    !finding ||
    typeof finding !== "object" ||
    typeof finding.riskCode !== "string" ||
    finding.riskCode.trim() === ""
  ) {
    return {
      riskCode: "INVALID_FINDING",
      severity: "high",
      title: "Invalid security finding",
      explanation:
        "The security finding is missing a valid risk code.",
      recommendedAction:
        "Do not proceed until the transaction finding is validated.",
      source: "deterministic_rule"
    };
  }

  // 2. Find the risk code in our catalogue
  const riskCode = finding.riskCode.trim().toUpperCase();
  const risk = RISK_CATALOG[riskCode];

  // 3. Handle unknown risk codes safely
  if (!risk) {
    return {
      riskCode: "UNKNOWN_RISK_CODE",
      severity: "high",
      title: "Unknown security risk",
      explanation:
        "The system received a risk code that is not recognised.",
      recommendedAction:
        "Do not approve this transaction until the risk is reviewed.",
      source: "deterministic_rule"
    };
  }

  // 4. Return the matching explanation
  return {
    riskCode,
    severity: risk.severity,
    title: risk.title,
    explanation: risk.explanation,
    recommendedAction: risk.recommendedAction,
    source: "deterministic_rule"
  };
}
