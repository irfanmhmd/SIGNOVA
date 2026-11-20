import type { TransactionIntent } from '../types/transaction';

const intents: TransactionIntent[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function saveIntent(intent: TransactionIntent): void {
  const index = intents.findIndex((item) => item.id === intent.id);

  if (index >= 0) {
    intents[index] = intent;
  } else {
    intents.unshift(intent);
  }

  notify();
}

export function getIntents(): TransactionIntent[] {
  return [...intents];
}

export function getIntentById(
  id: string,
): TransactionIntent | undefined {
  return intents.find((intent) => intent.id === id);
}

export function subscribeToIntents(
  listener: () => void,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}