
import type {
  FirewallInspection,
  IntentReviewState,
  TransactionIntent,
} from '../types/transaction';

/**
 * Creates the initial review state for a transaction.
 */
export function createReviewState(
  intent: TransactionIntent,
): IntentReviewState {
  return {
    intent,
    inspection: null,
    inspectedRevision: null,
    currentRevision: 0,
  };
}

/**
 * Updates transaction details and invalidates the old inspection.
 */
export function updateIntent(
  state: IntentReviewState,
  updates: Partial<
    Pick<TransactionIntent, 'token' | 'recipient' | 'amount' | 'expiryHours'>
  >,
): IntentReviewState {
  const updatedIntent = {
    ...state.intent,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const changed = (
    Object.keys(updates) as Array<keyof typeof updates>
  ).some((key) => state.intent[key] !== updatedIntent[key]);

  if (!changed) {
    return state;
  }

  return {
    ...state,
    intent: updatedIntent,
    currentRevision: state.currentRevision + 1,
    inspection: null,
    inspectedRevision: null,
  };
}

/**
 * Records an inspection result returned by the inspection service.
 */
export function recordInspection(
  state: IntentReviewState,
  inspection: FirewallInspection,
): IntentReviewState {
  if (inspection.intentId !== state.intent.id) {
    throw new Error('Inspection belongs to a different transaction.');
  }

  if (inspection.status !== 'completed') {
    throw new Error('Only completed inspections can be recorded.');
  }

  return {
    ...state,
    inspection,
    inspectedRevision: state.currentRevision,
  };
}

/**
 * Checks whether the current transaction has a fresh inspection.
 */
export function isInspectionFresh(
  state: IntentReviewState,
): boolean {
  return (
    state.inspection !== null &&
    state.inspection.status === 'completed' &&
    state.inspectedRevision === state.currentRevision &&
    state.inspection.intentId === state.intent.id
  );
}
