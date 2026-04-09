export type FatigueLevel = 'optimo' | 'precaucion' | 'riesgo';

export type ExamStatus = 'pendiente' | 'completado';

export interface MedicalExam {
  id: string;
  type: string;
  date: string;
  location: string;
  status: ExamStatus;
  result?: string;
  preparation: string[];
}

export interface HealthMetric {
  heartRate: number;
  steps: number;
  deepSleep: number;
  sleepQuality: string;
}
