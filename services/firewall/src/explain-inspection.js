import { explainFinding } from "../../explanation/src/index.js";
export function explainInspection(inspection) {
  if (!inspection || typeof inspection !== "object") {
    return {
      decision: "UNKNOWN",
      explanations: [
        explainFinding(null)
      ]
    };
  }
  const findings = Array.isArray(inspection.findings)
    ? inspection.findings
    : [];
  const explanations = findings.length > 0
    ? findings.map(finding => explainFinding(finding))
    : [explainFinding({ riskCode: inspection.reason })];
  return {
    decision: inspection.decision ?? "UNKNOWN",
    explanations
  };
}
