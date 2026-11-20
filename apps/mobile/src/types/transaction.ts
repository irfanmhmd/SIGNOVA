
export type IntentStatus =
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'executed'
  | 'expired';

export type InspectionStatus =
  | 'not_inspected'
  | 'inspecting'
  | 'completed'
  | 'failed'
  | 'stale';

export type FirewallDecision =
  | 'allow'
  | 'warn'
  | 'block'
  | 'unknown';

export type FindingSeverity =
  | 'info'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface TransactionIntent {
  id: string;
  token: string;
  recipient: string;
  amount: string;
  expiryHours: number;
  status: IntentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  recommendation?: string;
}

export interface FirewallInspection {
  id: string;
  intentId: string;
  decision: FirewallDecision;
  status: InspectionStatus;
  findings: SecurityFinding[];
  inspectedAt?: string;
}

export interface IntentReviewState {
  intent: TransactionIntent;
  inspection: FirewallInspection | null;
  inspectedRevision: number | null;
  currentRevision: number;
}
