import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserI } from 'src/app/interfaces/user.module';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  currentImage = 'assets/images/light.jpg';
  themeService = inject(ThemeService)
  utilsService = inject(UtilsService);
  authService = inject(AuthService);

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  async registrar() {
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
      const res = await this.authService
        .registrar(this.form.value as UserI)
        .then((res) => {
          this.authService.actualizar(this.form.value.name);

          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);
          this.setUserInfo(uid);
        });

      this.utilsService.presentToast({
        message: 'Registro exitoso',
        duration: 2000,
        color: 'success',
        position: 'middle',
        icon: 'person-outline'
      });
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
      });
    } finally {
      loading.dismiss();
    }
  }



  async setUserInfo(uid: string) {
    if(this.form.valid){

      const loading = await this.utilsService.loading();
      await loading.present();

      let path = `users/${uid}`
      delete this.form.value.password;

      this.authService.setDocument(path, this.form.value).then(async res => {

        this.utilsService.saveInLocalStorage('user', this.form.value)
        this.utilsService.routerLink('/home')
        this.form.reset();

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
