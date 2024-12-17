import { Component, inject, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { Evento } from 'src/app/interfaces/eventos.module';
import { Fecha } from 'src/app/interfaces/pendientes.module';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PendientesService } from 'src/app/services/pendientes.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {
  eventos: Evento[] = [];
  pendientes: Fecha[] = [];
  authService = inject(AuthService);
  firebaseService = inject(FirebaseService);
  pendientesService = inject(PendientesService);

  constructor() {}

  ngOnInit() {
    this.getEventosYPendientes(); // Llamamos al método que obtiene los eventos y pendientes
  }

  // Método para obtener eventos y pendientes
  getEventosYPendientes() {
    // Llamar al servicio para obtener eventos
    this.firebaseService.getEventos().subscribe((eventos: Evento[]) => {
      this.eventos = eventos;
    });

    // Llamar al servicio para obtener pendientes
    this.pendientesService.getPendientes().subscribe((pendientes: Fecha[]) => {
      this.pendientes = pendientes;
    });
  }

  getPendienteForFecha(eventoFecha: string): number {
    return this.getSumaPendientesPorFecha(eventoFecha);
  }

  getSumaPendientesPorFecha(fecha: string): number {
    const fechaPendiente = this.pendientes.find((p) => p.fecha === fecha);
    if (fechaPendiente) {
      return fechaPendiente.pendiente.reduce(
        (total, pendiente) => total + (pendiente.precio || 0),
        0
      );
    }
    return 0; // Si no hay pendientes, retorna 0
  }
}
