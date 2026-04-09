export type CertificateStatus = 'vigente' | 'vencido' | 'en_curso';

export interface Certificate {
  id: string;
  name: string;
  issuedBy: string;
  date: string;
  expiresAt?: string;
  status: CertificateStatus;
  progress?: number;
  xpReward: number;
}

export type CourseDifficulty = 'basico' | 'intermedio' | 'avanzado';
export type CourseType = 'obligatorio' | 'recomendado' | 'voluntario';

export interface Course {
  id: string;
  name: string;
  hours: number;
  xpReward: number;
  difficulty: CourseDifficulty;
  type: CourseType;
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
