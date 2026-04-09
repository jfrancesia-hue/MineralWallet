export type SOSEventType = 'sos' | 'report';
export type SOSStatus = 'activated' | 'resolved' | 'cancelled';

export interface SOSEvent {
  id: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  type: SOSEventType;
  status: SOSStatus;
}

export type EmergencyContactRole = 'family' | 'mine' | 'medical';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  role: EmergencyContactRole;
  label: string;
}

export interface SafetyTalk {
  id: string;
  title: string;
  duration: string;
  date: string;
  completed: boolean;
}
