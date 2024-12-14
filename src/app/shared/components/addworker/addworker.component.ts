import { Component, inject, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Encargado } from 'src/app/interfaces/encargado.module';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-addworker',
  templateUrl: './addworker.component.html',
  styleUrls: ['./addworker.component.scss'],
})
export class AddworkerComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  modalControlller = inject(ModalController);
  toastControlller = inject(ToastController);

  encargado: Encargado[] = [];

  nombreEncargado: string = '';
  tipoEncargado: string = '';
  celularEncargado: string = '';

  async guardarEncargado() {
    if (!this.nombreEncargado.trim()) {
      this.mostrarToast('Por favor ingrese el nombre del encargado', 'warning');
      return;
    }

    if (!this.tipoEncargado.trim()) {
      this.mostrarToast('Por favor ingrese el tipo de encargado', 'warning');
      return;
    }

    if (!this.celularEncargado.trim()) {
      this.mostrarToast('Por favor ingrese el número de celular del encargado', 'warning');
      return;
    }

    const nuevoEncargado: Encargado = {
      nombre: this.nombreEncargado.trim(),
      tipo: this.tipoEncargado.trim(),
      celular: this.celularEncargado.trim() 
    };

    try {
      await this.firebaseService.addEncargado(nuevoEncargado);
      this.mostrarToast('Encargado agregado exitosamente', 'success');
      this.modalControlller.dismiss(true);
    } catch (error) {
      console.error('Error al agregar Encargado:', error);
      this.mostrarToast('Error al agregar el Encargado', 'danger');
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
      position: 'bottom',
    });
    toast.present();
  }

  constructor() {}

  ngOnInit() {}
}
