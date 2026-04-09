import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { careerService } from '../services/career.service';
import type { Certificate, Course, RankingEntry } from '../types';

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
  isLoading: boolean;
  error: string | null;
}

interface CareerActions {
  fetchSummary: () => Promise<void>;
  startCourse: (courseId: string) => Promise<void>;
  completeModule: (courseId: string) => Promise<void>;
  addXP: (amount: number) => void;
  clearError: () => void;
}

type CareerStore = CareerState & CareerActions;

const initialState: CareerState = {
  level: '',
  nextLevel: '',
  xpCurrent: 0,
  xpRequired: 0,
  xpPercent: 0,
  certificatesNeeded: 0,
  certificates: [],
  courses: [],
  ranking: [],
  positionChange: 0,
  isLoading: false,
  error: null,
};

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchSummary: async () => {
        set({ isLoading: true, error: null });
        const [summaryRes, certsRes, coursesRes, rankingRes] = await Promise.all([
          careerService.getSummary(),
          careerService.getCertificates(),
          careerService.getCourses(),
          careerService.getRanking(),
        ]);

        if (summaryRes.success && summaryRes.data) {
          const { level, nextLevel, xpCurrent, xpRequired, certificatesNeeded, positionChange } = summaryRes.data;
          set({
            level,
            nextLevel,
            xpCurrent,
            xpRequired,
            xpPercent: xpRequired > 0 ? Math.round((xpCurrent / xpRequired) * 100) : 0,
            certificatesNeeded,
            positionChange,
          });
        } else {
          set({ isLoading: false, error: summaryRes.error?.message ?? 'Error al obtener resumen de carrera' });
          return;
        }

        if (certsRes.success && certsRes.data) {
          set({ certificates: certsRes.data });
        }

        if (coursesRes.success && coursesRes.data) {
          set({ courses: coursesRes.data });
        }

        if (rankingRes.success && rankingRes.data) {
          set({ ranking: rankingRes.data });
        }

        set({ isLoading: false });
      },

      startCourse: async (courseId) => {
        set({ isLoading: true, error: null });
        const response = await careerService.startCourse(courseId);
        if (response.success && response.data) {
          set((state) => ({
            courses: state.courses.map((c) => c.id === courseId ? response.data! : c),
            isLoading: false,
          }));
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al iniciar curso' });
        }
      },

      completeModule: async (courseId) => {
        // Optimistic update: increment progress by 20%
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId
              ? { ...c, progress: Math.min(c.progress + 20, 100), completed: c.progress + 20 >= 100 }
              : c
          ),
          error: null,
        }));

        const prevCourses = get().courses;
        const response = await careerService.completeModule(courseId);
        if (response.success && response.data) {
          set((state) => ({
            courses: state.courses.map((c) => c.id === courseId ? response.data! : c),
          }));
        } else {
          // Roll back optimistic update
          set({
            courses: prevCourses,
            error: response.error?.message ?? 'Error al completar modulo',
          });
        }
      },

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xpCurrent + amount;
          return {
            xpCurrent: newXP,
            xpPercent: state.xpRequired > 0 ? Math.round((newXP / state.xpRequired) * 100) : 0,
          };
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-career',
      storage: mmkvStorage,
      partialize: (state) => ({
        level: state.level,
        nextLevel: state.nextLevel,
        xpCurrent: state.xpCurrent,
        xpRequired: state.xpRequired,
        xpPercent: state.xpPercent,
        certificatesNeeded: state.certificatesNeeded,
        certificates: state.certificates,
        courses: state.courses,
        ranking: state.ranking,
        positionChange: state.positionChange,
      }),
    }
  )
);
