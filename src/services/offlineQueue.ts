import type { OfflineAction } from '../types';

const MAX_RETRIES = 3;
const STORAGE_KEY = 'mineral-offline-queue';

let storage: { getString: (key: string) => string | undefined; set: (key: string, value: string) => void } | null = null;

function getStorage() {
  if (!storage) {
    try {
      const { MMKV } = require('react-native-mmkv');
      storage = new MMKV({ id: 'mineral-offline' });
    } catch {
      const mem = new Map<string, string>();
      storage = {
        getString: (key: string) => mem.get(key),
        set: (key: string, value: string) => { mem.set(key, value); },
      };
    }
  }
  return storage!;
}

let queue: OfflineAction[] = [];
let processing = false;

function persist(): void {
  try {
    getStorage().set(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Silent fail — queue stays in memory
  }
}

export function rehydrate(): void {
  try {
    const raw = getStorage().getString(STORAGE_KEY);
    if (raw) {
      queue = JSON.parse(raw);
    }
  } catch {
    queue = [];
  }
}

// Action type constants
export const OfflineActionType = {
  SOS_ACTIVATE: 'SOS_ACTIVATE',
  WALLET_TRANSFER: 'WALLET_TRANSFER',
  WALLET_ADELANTO: 'WALLET_ADELANTO',
  WALLET_USDT: 'WALLET_USDT',
  WALLET_FAMILY_SEND: 'WALLET_FAMILY_SEND',
  WORK_CHECK_IN: 'WORK_CHECK_IN',
  WORK_CHECK_OUT: 'WORK_CHECK_OUT',
  HEALTH_HYDRATION: 'HEALTH_HYDRATION',
  HEALTH_MOOD: 'HEALTH_MOOD',
  HEALTH_METRICS: 'HEALTH_METRICS',
  SAFETY_TALK_COMPLETE: 'SAFETY_TALK_COMPLETE',
  BENEFITS_REDEEM: 'BENEFITS_REDEEM',
  CAREER_COMPLETE_MODULE: 'CAREER_COMPLETE_MODULE',
  NOTIFICATIONS_MARK_READ: 'NOTIFICATIONS_MARK_READ',
} as const;

export function enqueue(type: string, payload: unknown): string {
  const action: OfflineAction = {
    id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    createdAt: Date.now(),
    retries: 0,
  };
  queue.push(action);
  persist();
  return action.id;
}

export function getQueue(): OfflineAction[] {
  return [...queue];
}

export function getPendingCount(): number {
  return queue.length;
}

export function clearQueue(): void {
  queue = [];
  persist();
}

export async function processQueue(
  handler: (action: OfflineAction) => Promise<boolean>
): Promise<{ processed: number; failed: number }> {
  if (processing || queue.length === 0) {
    return { processed: 0, failed: 0 };
  }

  processing = true;
  let processed = 0;
  let failed = 0;
  const remaining: OfflineAction[] = [];

  for (const action of queue) {
    try {
      const success = await handler(action);
      if (success) {
        processed++;
      } else {
        action.retries++;
        if (action.retries < MAX_RETRIES) {
          remaining.push(action);
        } else {
          failed++;
        }
      }
    } catch {
      action.retries++;
      if (action.retries < MAX_RETRIES) {
        remaining.push(action);
      } else {
        failed++;
      }
    }
  }

  queue = remaining;
  processing = false;
  persist();
  return { processed, failed };
}
