import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

export interface Certificate {
  id: string;
  name: string;
  issuedBy: string;
  date: string;
  expiresAt?: string;
  status: 'vigente' | 'vencido' | 'en_curso';
  progress?: number;
  xpReward: number;
}

export interface Course {
  id: string;
  name: string;
  hours: number;
  xpReward: number;
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  type: 'obligatorio' | 'recomendado' | 'voluntario';
  validity: string;
  progress: number;
  completed: boolean;
}

export interface RankingEntry {
  position: number;
  name: string;
  xp: number;
  isCurrentUser: boolean;
}

interface CareerState {
  level: string;
  nextLevel: string;
  xpCurrent: number;
  xpRequired: number;
  xpPercent: number;
  certificatesNeeded: number;
  certificates: Certificate[];
  courses: Course[];
  ranking: RankingEntry[];
  positionChange: number;

  completeModule: (courseId: string) => void;
  addXP: (amount: number) => void;
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set) => ({
      level: 'Operador Senior A',
      nextLevel: 'Supervisor Junior',
      xpCurrent: 2400,
      xpRequired: 3000,
      xpPercent: 80,
      certificatesNeeded: 2,
      certificates: [
        { id: 'cert-1', name: 'Operacion de Dumper CAT 797', issuedBy: 'CERT-00521-2021', date: '2023-10-12', status: 'vigente', xpReward: 500 },
        { id: 'cert-2', name: 'Induccion General de Mina', issuedBy: 'CERT-16291-2022', date: '2022-01-05', status: 'vigente', xpReward: 200 },
        { id: 'cert-3', name: 'Trabajo en Altura', issuedBy: '', date: '', status: 'en_curso', progress: 60, xpReward: 400 },
      ],
      courses: [
        { id: 'c-1', name: 'Seguridad en Excavacion Profunda', hours: 8, xpReward: 400, difficulty: 'avanzado', type: 'obligatorio', validity: '2 anos', progress: 0, completed: false },
        { id: 'c-2', name: 'Mantenimiento Predictivo 4.0', hours: 12, xpReward: 300, difficulty: 'intermedio', type: 'obligatorio', validity: '1 ano', progress: 0, completed: false },
        { id: 'c-3', name: 'Protocolo de Primeros Auxilios', hours: 4, xpReward: 150, difficulty: 'basico', type: 'obligatorio', validity: '3 anos', progress: 0, completed: false },
      ],
      ranking: [
        { position: 5, name: 'Carlos R.', xp: 4100, isCurrentUser: false },
        { position: 6, name: 'Elena M.', xp: 3800, isCurrentUser: false },
        { position: 7, name: 'TU', xp: 2400, isCurrentUser: true },
        { position: 8, name: 'Javier S.', xp: 2200, isCurrentUser: false },
      ],
      positionChange: 3,

      completeModule: (courseId) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, progress: Math.min(c.progress + 20, 100), completed: c.progress + 20 >= 100 } : c
          ),
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xpCurrent + amount;
          return {
            xpCurrent: newXP,
            xpPercent: Math.round((newXP / state.xpRequired) * 100),
          };
        }),
    }),
    { name: 'mineral-career', storage: mmkvStorage }
  )
);
