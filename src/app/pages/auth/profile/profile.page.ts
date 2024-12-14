import { Component, inject, OnInit } from '@angular/core';
import { UserI } from 'src/app/interfaces/user.module';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userInfo: { name: string, email: string } | null = null;
  authService = inject(AuthService);
  utilsService = inject(UtilsService);

  async cerrarSesion() {
    this.authService.cerrarSesion();
  }

  constructor() {}

  ngOnInit() {
    // Obtener los datos del usuario desde localStorage
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
