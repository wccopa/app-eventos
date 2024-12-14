import { Component, inject, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Plato } from 'src/app/interfaces/plato.module';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-addfoods',
  templateUrl: './addfoods.component.html',
  styleUrls: ['./addfoods.component.scss'],
})
export class AddfoodsComponent  implements OnInit {

  firebaseService = inject(FirebaseService);
  modalControlller = inject(ModalController);
  toastControlller = inject(ToastController);
  platos: Plato[] = [];

  nombrePlato: string = '';

  async guardarPlato() {
    if (!this.nombrePlato.trim()) {
      this.mostrarToast('Por favor ingrese el nombre del plato', 'warning');
      return;
    }
    const nuevoPlato: Plato = {
      nombre: this.nombrePlato.trim()
    };

    try {
      await this.firebaseService.addPlato(nuevoPlato);
      this.mostrarToast('Plato agregado exitosamente', 'success');
      this.modalControlller.dismiss(true);
    } catch (error) {
      console.error('Error al agregar plato:', error);
      this.mostrarToast('Error al agregar el plato', 'danger');
    }
  }

  cancelar() {
    this.modalControlller.dismiss();
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastControlller.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  constructor() { }

  ngOnInit() {}

}
