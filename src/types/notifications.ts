export type NotifCategory = 'plata' | 'turnos' | 'seguridad' | 'salud' | 'beneficios';

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: NotifCategory;
  timestamp: number;
  read: boolean;
  actionRoute?: string;
}
