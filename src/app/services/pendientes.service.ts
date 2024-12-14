import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fecha, Pendiente } from '../interfaces/pendientes.module';

@Injectable({
  providedIn: 'root'
})
export class PendientesService {
  constructor(private firestore: AngularFirestore) {}

  // Method to get document by fecha
  async getDocumentByFecha(fecha: string): Promise<Fecha | null> {
    try {
      const querySnapshot = await this.firestore
        .collection<Fecha>('fechas', ref => ref.where('fecha', '==', fecha))
        .get()
        .toPromise();

      if (!querySnapshot || querySnapshot.empty) {
        return null;
      }

      // Assuming we want the first matching document
      const doc = querySnapshot.docs[0];
      return { 
        ...doc.data(), 
        uid: doc.id 
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  // Method to update pendientes for a specific fecha
  async updatePendientesForFecha(uid: string, pendientes: Pendiente[]): Promise<void> {
    try {
      await this.firestore.collection('fechas').doc(uid).update({ pendiente: pendientes });
    } catch (error) {
      console.error('Error updating pendientes:', error);
      throw error;
    }
  }

  // Method to create a new fecha document
  async createFechaDocument(fecha: string, pendientes: Pendiente[]): Promise<DocumentReference> {
    return this.firestore.collection<Fecha>('fechas').add({
      fecha: fecha,
      pendiente: pendientes
    });
  }
}