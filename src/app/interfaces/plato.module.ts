export interface Plato {
  id?: string;
  nombre: string;
  componentes?: ComponentesPlato[];
}

export interface ResponsePlato {
  platos: Plato[];
}

export interface ComponentesPlato {
  id?: string;
  nombre: string;
  cantidad?: string;
  detalles?: string;
}
