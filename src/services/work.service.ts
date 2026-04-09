import { api } from './apiClient';
import type { Shift, PayStub, EPPItem } from '../types';

interface WorkSummary {
  currentShift: Shift | null;
  hoursThisMonth: number;
  overtimeHours: number;
  nightHours: number;
  overtimePay: number;
  isCheckedIn: boolean;
  checkInTime: string | null;
  supervisor: { name: string; role: string };
}

export const workService = {
  getSummary: () =>
    api.get<WorkSummary>('/work/summary'),

  getShifts: (month?: string) =>
    api.get<Shift[]>('/work/shifts', month ? { month } : undefined),

  checkIn: () =>
    api.post<{ checkInTime: string }>('/work/check-in'),

  checkOut: () =>
    api.post<{ checkOutTime: string }>('/work/check-out'),

  getPayStubs: (year?: number) =>
    api.get<PayStub[]>('/work/pay-stubs', year ? { year: String(year) } : undefined),

  getPayStubPdf: (payStubId: string) =>
    api.get<{ pdfUrl: string }>(`/work/pay-stubs/${payStubId}/pdf`),

  getEPP: () =>
    api.get<EPPItem[]>('/work/epp'),

  requestEPPRenewal: (eppId: string) =>
    api.post<EPPItem>(`/work/epp/${eppId}/renew`),
};
