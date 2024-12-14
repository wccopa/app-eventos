import { Extra } from './extras.module';

export interface Evento {
  id?: string;
  cliente: string; //
  numCliente: string;//
  fecha: string;//
  tipoEvento: string;//
  platoId: string;//
  platoNombre: string;//
  cantidadPersonas: number;//
  precioEvento: number;//
  hora: string;//
  extras: Extra[];//
  adelanto: Adelanto[];//
  estado?: 'pendiente' | 'pagado';
  createdAt?: Date; //fecha de creacion
  updatedAt?: Date; //ultima modificacion
  adicional?: Adicional[];
  numMesas?: number;
  numSillas?: number
}

export interface Adicional{
  id?: string;
  nombre: string;
}

export interface Adelanto{
  id?: string;
  fechaAdelanto?: string;
  montoAdelanto: number;
}