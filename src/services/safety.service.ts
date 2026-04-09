import { api } from './apiClient';
import type { SOSEvent, EmergencyContact, SafetyTalk } from '../types';

interface SafetySummary {
  safetyScore: number;
  incidentCount: number;
  consecutiveTalks: number;
  eppCompliancePercent: number;
  lastSOSTest: string;
  completedCourses: number;
  totalCourses: number;
}

interface SOSActivation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export const safetyService = {
  getSummary: () =>
    api.get<SafetySummary>('/safety/summary'),

  activateSOS: (data: SOSActivation) =>
    api.post<SOSEvent>('/safety/sos/activate', data),

  cancelSOS: (sosId: string) =>
    api.post<SOSEvent>(`/safety/sos/${sosId}/cancel`),

  getSOSHistory: () =>
    api.get<SOSEvent[]>('/safety/sos/history'),

  getEmergencyContacts: () =>
    api.get<EmergencyContact[]>('/safety/emergency-contacts'),

  updateEmergencyContact: (contactId: string, data: Partial<EmergencyContact>) =>
    api.patch<EmergencyContact>(`/safety/emergency-contacts/${contactId}`, data),

  getTodayTalk: () =>
    api.get<SafetyTalk>('/safety/talks/today'),

  completeTalk: (talkId: string) =>
    api.post<SafetyTalk>(`/safety/talks/${talkId}/complete`),

  getTalkHistory: () =>
    api.get<SafetyTalk[]>('/safety/talks/history'),
};
