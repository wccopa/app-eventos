import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  loadingController = inject(LoadingController);
  toastController = inject(ToastController); 
  router = inject(Router);

  loading(){
    return this.loadingController.create({
      message: 'Ingresando',
      spinner: 'crescent',
      duration: 1500
    });
  }

  async presentToast(opts: ToastOptions){
    const toast = await this.toastController.create({
      ...opts,
      cssClass: opts.color === 'success' ? 'success-toast' : 'error-toast'
    });
    toast.present();
  }

  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }
}