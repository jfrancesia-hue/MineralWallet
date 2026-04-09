import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

export interface Shift {
  id: string;
  type: 'manana' | 'tarde' | 'noche';
  startTime: string;
  endTime: string;
  sector: string;
  level: string;
  dayOfRotation: number;
  totalDays: number;
  date: string;
}

export interface PayStub {
  id: string;
  period: string;
  month: string;
  year: number;
  haberes: { label: string; amount: number }[];
  descuentos: { label: string; amount: number }[];
  totalHaberes: number;
  totalDescuentos: number;
  neto: number;
  paidDate: string;
}

export interface EPPItem {
  id: string;
  name: string;
  status: 'vigente' | 'por_vencer' | 'vencido' | 'no_requerido';
  expiresAt?: string;
  reviewDate?: string;
}

interface WorkState {
  currentShift: Shift | null;
  shifts: Shift[];
  hoursThisMonth: number;
  overtimeHours: number;
  nightHours: number;
  overtimePay: number;
  payStubs: PayStub[];
  eppItems: EPPItem[];
  supervisor: { name: string; role: string };
  checkInTime: string | null;
  isCheckedIn: boolean;

  checkIn: () => void;
  checkOut: () => void;
}

export const useWorkStore = create<WorkState>()(
  persist(
    (set) => ({
      currentShift: {
        id: 'shift-1',
        type: 'manana',
        startTime: '06:00',
        endTime: '14:00',
        sector: 'Sector Norte',
        level: 'Nivel -3',
        dayOfRotation: 5,
        totalDays: 7,
        date: '2026-04-09',
      },
      shifts: [],
      hoursThisMonth: 168,
      overtimeHours: 24,
      nightHours: 0,
      overtimePay: 45600,
      payStubs: [
        {
          id: 'ps-1',
          period: 'Abril 2026',
          month: 'Abril',
          year: 2026,
          haberes: [
            { label: 'Sueldo Basico', amount: 520000 },
            { label: 'Adicional Zona Desfavorable', amount: 104000 },
            { label: 'Horas Extra 50%', amount: 45600 },
            { label: 'Antiguedad (7 anos)', amount: 36400 },
            { label: 'Bono Asistencia', amount: 25000 },
          ],
          descuentos: [
            { label: 'Jubilacion 11%', amount: 80410 },
            { label: 'Obra Social 3%', amount: 21930 },
            { label: 'Sindicato 2.5%', amount: 18275 },
            { label: 'Adelanto de Sueldo', amount: 150000 },
            { label: 'Cuota Microcredito', amount: 45000 },
          ],
          totalHaberes: 731000,
          totalDescuentos: 315615,
          neto: 415385,
          paidDate: '2026-04-01',
        },
      ],
      eppItems: [
        { id: 'epp-1', name: 'Casco MSA V-Gard', status: 'vigente', reviewDate: '08/2026' },
        { id: 'epp-2', name: 'Botas Pampero', status: 'vigente', reviewDate: '12/2026' },
        { id: 'epp-3', name: 'Proteccion Auditiva', status: 'por_vencer', expiresAt: '2026-04-20' },
        { id: 'epp-4', name: 'Arnes de Seguridad', status: 'vigente', reviewDate: '06/2026' },
        { id: 'epp-5', name: 'Lentes de Proteccion', status: 'vencido' },
      ],
      supervisor: { name: 'Martinez, Roberto', role: 'Supervisor de Turno' },
      checkInTime: '05:52',
      isCheckedIn: true,

      checkIn: () => set({ isCheckedIn: true, checkInTime: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) }),
      checkOut: () => set({ isCheckedIn: false }),
    }),
    { name: 'mineral-work', storage: mmkvStorage }
  )
);
