export interface Item{
    id?: string;
    nombre: string;
    fecha?: string;
    monto?: number;
    estado?: 'pendiente' | 'listo';
}