import { useEffect, useRef } from 'react';
import { useConnectivityStore } from '../stores';
import {
  processQueue,
  rehydrate,
  getPendingCount,
  OfflineActionType,
} from '../services/offlineQueue';
import type { OfflineAction } from '../types';
import { walletService } from '../services/wallet.service';
import { workService } from '../services/work.service';
import { safetyService } from '../services/safety.service';
import { healthService } from '../services/health.service';
import { benefitsService } from '../services/benefits.service';
import { careerService } from '../services/career.service';
import { notificationsService } from '../services/notifications.service';

async function handleOfflineAction(action: OfflineAction): Promise<boolean> {
  const p = action.payload as Record<string, unknown>;

  switch (action.type) {
    // CRITICAL — SOS
    case OfflineActionType.SOS_ACTIVATE: {
      const result = await safetyService.activateSOS({
        latitude: p.latitude as number,
        longitude: p.longitude as number,
      });
      return result.success;
    }

    // HIGH — Wallet
    case OfflineActionType.WALLET_TRANSFER: {
      const result = await walletService.transfer({
        toContactId: p.recipientId as string,
        amount: p.amount as number,
        description: p.description as string | undefined,
      });
      return result.success;
    }

    case OfflineActionType.WALLET_ADELANTO: {
      const result = await walletService.requestAdelanto({ amount: p.amount as number });
      return result.success;
    }

    case OfflineActionType.WALLET_USDT: {
      const result = await walletService.convertUsdt({
        amountArs: p.arsAmount as number,
        direction: p.direction as 'ars_to_usdt' | 'usdt_to_ars',
      });
      return result.success;
    }

    case OfflineActionType.WALLET_FAMILY_SEND: {
      const result = await walletService.sendToFamily(p.contactId as string, p.amount as number);
      return result.success;
    }

    // HIGH — Work
    case OfflineActionType.WORK_CHECK_IN: {
      const result = await workService.checkIn();
      return result.success;
    }

    case OfflineActionType.WORK_CHECK_OUT: {
      const result = await workService.checkOut();
      return result.success;
    }

    // MEDIUM — Health
    case OfflineActionType.HEALTH_HYDRATION: {
      const result = await healthService.logHydration(p.ml as number);
      return result.success;
    }

    case OfflineActionType.HEALTH_MOOD: {
      const result = await healthService.logMood(p.mood as number, p.note as string | undefined);
      return result.success;
    }

    case OfflineActionType.HEALTH_METRICS: {
      const result = await healthService.updateMetrics(p.metrics as Record<string, unknown>);
      return result.success;
    }

    // MEDIUM — Safety
    case OfflineActionType.SAFETY_TALK_COMPLETE: {
      const result = await safetyService.completeTalk(p.talkId as string);
      return result.success;
    }

    // MEDIUM — Benefits
    case OfflineActionType.BENEFITS_REDEEM: {
      const result = await benefitsService.redeemBenefit(p.businessId as string, p.amount as number);
      return result.success;
    }

    // LOW — Career
    case OfflineActionType.CAREER_COMPLETE_MODULE: {
      const result = await careerService.completeModule(p.courseId as string);
      return result.success;
    }

    // LOW — Notifications
    case OfflineActionType.NOTIFICATIONS_MARK_READ: {
      const result = await notificationsService.markAsRead(p.notificationId as string);
      return result.success;
    }

    default:
      return false;
  }
}

export function useOfflineSync() {
  const isOnline = useConnectivityStore((s) => s.isOnline);
  const setSyncing = useConnectivityStore((s) => s.setSyncing);
  const wasOffline = useRef(false);

  // Rehydrate queue from MMKV on mount
  useEffect(() => {
    rehydrate();
    const count = getPendingCount();
    if (count > 0) {
      useConnectivityStore.setState({ pendingSyncCount: count });
    }
  }, []);

  // When transitioning from offline to online, process the queue
  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }

    if (wasOffline.current || getPendingCount() > 0) {
      wasOffline.current = false;

      setSyncing(true);
      processQueue(handleOfflineAction).then(({ processed, failed }) => {
        setSyncing(false);
        useConnectivityStore.setState({ pendingSyncCount: getPendingCount() });

        if (processed > 0) {
          // Silently refresh stores that may have been affected
          // Screens will pick up new data via their own fetch calls
        }
      });
    }
  }, [isOnline, setSyncing]);
}
