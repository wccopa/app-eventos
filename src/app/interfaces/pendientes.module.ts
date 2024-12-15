import { Observable } from "rxjs";

export interface Pendiente {
  nombre: string;
  estado: 'completado' | 'incompleto'; // More strict type for estado
  precio?: number;
  uid?: string;
}

export interface Fecha {
  fecha: string;
  pendiente: Pendiente[];
  uid?: string;
}

export type PendienteObservable = Observable<Pendiente>;
export type FechaObservable = Observable<Fecha>;
export type PendientesObservable = Observable<Pendiente[]>;
export type FechasObservable = Observable<Fecha[]>;