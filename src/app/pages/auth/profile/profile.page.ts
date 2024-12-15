import { Component, inject, OnInit } from '@angular/core';
import { Evento } from 'src/app/interfaces/eventos.module';
import { Fecha, Pendiente } from 'src/app/interfaces/pendientes.module';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PendientesService } from 'src/app/services/pendientes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userInfo: { name: string, email: string } | null = null;
  eventos: Evento[] = [];
  pendientes: Fecha[] = [];
  authService = inject(AuthService);
  firebaseService = inject(FirebaseService);
  pendientesService = inject(PendientesService);

  async cerrarSesion() {
    this.authService.cerrarSesion();
  }

  constructor() {}

  ngOnInit() {
    this.getEventosYPendientes();  // Llamamos al método que obtiene los eventos y pendientes
    this.userInfo = this.getUserInfo();
  }

  // Función para obtener los datos del usuario desde localStorage
  getUserInfo() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        name: user.name,
        email: user.email
      };
    } else {
      console.log('No se encontró el usuario en el localStorage');
      return null;
    }
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

  // Método para obtener el pendiente correspondiente a la fecha del evento
  getPendienteForFecha(eventoFecha: string): Pendiente | undefined {
    const fechaPendiente = this.pendientes.find(p => p.fecha === eventoFecha);
    return fechaPendiente?.pendiente[0];  // Suponiendo que el pendiente es un arreglo y tomamos el primero
  }
}
