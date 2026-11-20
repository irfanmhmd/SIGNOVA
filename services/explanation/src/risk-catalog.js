export const RISK_CATALOG = {
  RECIPIENT_MISMATCH: {
    severity: "critical",
    title: "Recipient changed",
    explanation:
      "The destination wallet is different from the wallet approved by the signers.",
    recommendedAction:
      "Reject this attempt and create a new consent request."
  },

  AMOUNT_MISMATCH: {
    severity: "critical",
    title: "Amount changed",
    explanation:
      "The transaction amount is different from the amount approved by the signers.",
    recommendedAction:
      "Reject this attempt and request approval for the correct amount."
  },

  CONSENT_EXPIRED: {
    severity: "high",
    title: "Consent expired",
    explanation:
      "The approval deadline has passed. This consent is no longer valid.",
    recommendedAction:
      "Create a new consent request and collect fresh approvals."
  },

  NONCE_ALREADY_USED: {
    severity: "high",
    title: "Consent already used",
    explanation:
      "This consent has already been consumed and cannot be reused.",
    recommendedAction:
      "Do not retry this consent. Create a new transaction intent."
  },

  INSUFFICIENT_SIGNERS: {
    severity: "high",
    title: "Not enough approvals",
    explanation:
      "The required number of unique authorised signers has not approved the transaction.",
    recommendedAction:
      "Collect approvals from the remaining authorised signers."
  },

  UNKNOWN_SIGNER: {
    severity: "high",
    title: "Unknown signer",
    explanation:
      "A signer is not included in the authorised signer list.",
    recommendedAction:
      "Reject the unauthorised signature and verify the signer list."
  },

  DUPLICATE_SIGNER: {
    severity: "high",
    title: "Duplicate signer",
    explanation:
      "The same signer has been submitted more than once.",
    recommendedAction:
      "Remove duplicate signatures and collect approvals from unique authorised signers."
  },

  UNLIMITED_APPROVAL: {
    severity: "high",
    title: "Unlimited token approval",
    explanation:
      "The token approval does not have a finite spending limit.",
    recommendedAction:
      "Avoid unlimited approval. Use a specific spending limit."
  },

  UNKNOWN_SPENDER: {
    severity: "medium",
    title: "Unknown spender",
    explanation:
      "The contract requesting token permission is not recognised by the configured policy.",
    recommendedAction:
      "Verify the spender address before granting token permission."
  },

  NO_KNOWN_POLICY_VIOLATION: {
    severity: "info",
    title: "No known policy violation",
    explanation:
      "No configured policy issue was found. This does not guarantee that the transaction is risk-free.",
    recommendedAction:
      "Review the transaction details carefully before approving."
  }
};
