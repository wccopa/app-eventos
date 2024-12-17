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
  authService = inject(AuthService);
  firebaseService = inject(FirebaseService);

  async cerrarSesion() {
    this.authService.cerrarSesion();
  }

  constructor() {}

  ngOnInit() {
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

  
  
}
