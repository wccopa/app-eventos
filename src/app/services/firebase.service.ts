import { inject, Injectable } from '@angular/core';
import { Plato } from '../interfaces/plato.module';
import { Evento } from '../interfaces/eventos.module';
import { collectionData, Firestore, collection, addDoc, doc, deleteDoc, updateDoc, query, where, getDocs, setDoc } from '@angular/fire/firestore';
import { Encargado } from '../interfaces/encargado.module';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore = inject(Firestore)

  async obtenerSiguienteNumeroCotizacion(): Promise<number> {
    const referenciaContador = doc(this.firestore, 'contadores/numeroCotizacion');
    
    try {
      const contador = await getDocs(collection(this.firestore, 'contadores'));
      
      if (contador.empty) {
        // Si no existe, crea el documento con el número 1
        await setDoc(referenciaContador, { actual: 1 });
        return 1;
      }

      // Obtener el documento de contador
      const contadorDoc = await getDocs(query(collection(this.firestore, 'contadores'), where('__name__', '==', 'numeroCotizacion')));
      
      if (contadorDoc.empty) {
        await setDoc(referenciaContador, { actual: 1 });
        return 1;
      }

      const actual = contadorDoc.docs[0].data() as { actual: number };
      const nuevoNumero = (actual.actual || 0) + 1;

      // Actualizar el contador
      await updateDoc(referenciaContador, { actual: nuevoNumero });
      return nuevoNumero;

    } catch (error) {
      console.error('Error al obtener número de cotización:', error);
      // Si hay cualquier error, devolver 1 como valor predeterminado
      return 1;
    }
  }

  getEncargado(): Observable<Encargado[]> {
    const encargadoRef = collection(this.firestore, 'encargado');
    return collectionData(encargadoRef, { idField: 'id' }) as Observable<Encargado[]>; 
  }

  // Agregar un plato
  addEncargado(encargado: Encargado) {
    const encargadoRef = collection(this.firestore, 'encargado');
    return addDoc(encargadoRef, encargado);
  }

  // Eliminar un plato
  deletePlato(id: string) {
    const platoDocRef = doc(this.firestore, `platos/${id}`);
    return deleteDoc(platoDocRef);
  }

  getPlatos(): Observable<Plato[]> {
    const platosRef = collection(this.firestore, 'platos');
    return collectionData(platosRef, { idField: 'id' }) as Observable<Plato[]>; 
  }

  // Agregar un plato
  addPlato(plato: Plato) {
    const platosRef = collection(this.firestore, 'platos');
    return addDoc(platosRef, plato);
  }

  // Eliminar un plato
  deleteEncargado(id: string) {
    const encargadoDocRef = doc(this.firestore, `encargado/${id}`);
    return deleteDoc(encargadoDocRef);
  }

  // Nuevos métodos para Eventos
  getEventos(): Observable<Evento[]> {
    const eventosRef = collection(this.firestore, 'eventos');
    return collectionData(eventosRef, { idField: 'id' }) as Observable<Evento[]>; 
  }

  getEventosPorFecha(fecha: string): Observable<Evento[]> {
    const eventosRef = collection(this.firestore, 'eventos');
    const q = query(eventosRef, where('fecha', '==', fecha));
  
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data();
  
          // Usamos la notación de corchetes para acceder a 'adelanto'
          const adelanto = Array.isArray(data["adelanto"]) ? data["adelanto"] : 
                          (data["adelanto"] ? [data["adelanto"]] : []);
  
          return {
            id: doc.id,
            ...data,
            adelanto  // Asignamos adelanto correctamente como arreglo
          } as Evento;
        })
      )
    );
  }
  
  

  addEvento(evento: Evento) {
    const eventosRef = collection(this.firestore, 'eventos');
    const eventoConFecha = {
      ...evento,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return addDoc(eventosRef, eventoConFecha);
  }

  updateEvento(id: string, evento: Partial<Evento>) {
    const eventoDocRef = doc(this.firestore, `eventos/${id}`);
    const eventoActualizado = {
      ...evento,
      updatedAt: new Date()
    };
    return updateDoc(eventoDocRef, eventoActualizado);
  }

  deleteEvento(id: string) {
    const eventoDocRef = doc(this.firestore, `eventos/${id}`);
    return deleteDoc(eventoDocRef);
  }

  // Método para verificar disponibilidad
  async verificarDisponibilidad(fecha: string, hora: string): Promise<boolean> {
    const eventosRef = collection(this.firestore, 'eventos');
    const q = query(
      eventosRef, 
      where('fecha', '==', fecha),
      where('hora', '==', hora)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.empty; // true si no hay eventos en esa fecha y hora
  }

  // Método para obtener eventos por rango de fechas
  getEventosPorRango(fechaInicio: string, fechaFin: string): Observable<Evento[]> {
    const eventosRef = collection(this.firestore, 'eventos');
    const q = query(
      eventosRef,
      where('fecha', '>=', fechaInicio),
      where('fecha', '<=', fechaFin)
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Evento))
      )
    );
  }
}