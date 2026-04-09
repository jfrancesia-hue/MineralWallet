export type ShiftType = 'manana' | 'tarde' | 'noche';

export interface Shift {
  id: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  sector: string;
  level: string;
  dayOfRotation: number;
  totalDays: number;
  date: string;
}

export interface PayStubLine {
  label: string;
  amount: number;
}

export interface PayStub {
  id: string;
  period: string;
  month: string;
  year: number;
  haberes: PayStubLine[];
  descuentos: PayStubLine[];
  totalHaberes: number;
  totalDescuentos: number;
  neto: number;
  paidDate: string;
}

export type EPPStatus = 'vigente' | 'por_vencer' | 'vencido' | 'no_requerido';

export interface EPPItem {
  id: string;
  name: string;
  status: EPPStatus;
  expiresAt?: string;
  reviewDate?: string;
}

export interface Supervisor {
  name: string;
  role: string;
}
