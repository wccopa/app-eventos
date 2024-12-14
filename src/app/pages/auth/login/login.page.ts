import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserI } from 'src/app/interfaces/user.module';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  themeService = inject(ThemeService)
  authService = inject(AuthService);
  utilsService = inject(UtilsService);

  currentImage = 'assets/images/light.jpg';


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  async ingresar() {
    if (!this.form.valid) {
      if (this.form.get('email').hasError('required')) {
        this.utilsService.presentToast({
          message: 'Por favor, ingrese su correo electrónico',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        return;
      }

      if (this.form.get('email').hasError('email')) {
        this.utilsService.presentToast({
          message: 'Por favor, ingrese un correo electrónico válido',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        return;
      }

      if (this.form.get('password').hasError('required')) {
        this.utilsService.presentToast({
          message: 'Por favor, ingrese su contraseña',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        return;
      }

      if (this.form.get('password').hasError('minlength')) {
        this.utilsService.presentToast({
          message: 'La contraseña debe tener al menos 8 caracteres',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        return;
      }
    }

    const loading = await this.utilsService.loading();
    loading.present();

    try {
      const res = await this.authService.ingresar(this.form.value as UserI);
      this.getUserInfo(res.user.uid);
      
    } catch (err) {
      console.log(err);
      
      let errorMessage = 'Error al iniciar sesión';
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Correo electrónico o contraseña incorrectos';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      }

      this.utilsService.presentToast({
        message: errorMessage,
        duration: 2000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  } 


  async getUserInfo(uid: string) {
    if(this.form.valid){

      const loading = await this.utilsService.loading();
      await loading.present();

      let path = `users/${uid}`

      this.authService.getDocument(path).then((user: UserI) => {

        this.utilsService.saveInLocalStorage('user', user)
        this.utilsService.routerLink('/home')
        this.form.reset();

        this.utilsService.presentToast({
          message: 'Bienvenido  ' + user.name,
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'person-outline'
        });

      }).catch(error => {
        console.log(error);
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
  ngOnInit() {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.currentImage = isDark
        ? 'assets/images/dark.jpg'
        : 'assets/images/light.jpg';
    });
  }
}