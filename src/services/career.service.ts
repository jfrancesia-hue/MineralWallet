import { api } from './apiClient';
import type { Certificate, Course, RankingEntry } from '../types';

interface CareerSummary {
  level: string;
  nextLevel: string;
  xpCurrent: number;
  xpRequired: number;
  certificatesNeeded: number;
  positionChange: number;
}

export const careerService = {
  getSummary: () =>
    api.get<CareerSummary>('/career/summary'),

  getCertificates: () =>
    api.get<Certificate[]>('/career/certificates'),

  getCourses: () =>
    api.get<Course[]>('/career/courses'),

  startCourse: (courseId: string) =>
    api.post<Course>(`/career/courses/${courseId}/start`),

  completeModule: (courseId: string) =>
    api.post<Course>(`/career/courses/${courseId}/complete-module`),

  getRanking: () =>
    api.get<RankingEntry[]>('/career/ranking'),
};
