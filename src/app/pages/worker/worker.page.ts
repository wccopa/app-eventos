import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Encargado } from 'src/app/interfaces/encargado.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddworkerComponent } from 'src/app/shared/components/addworker/addworker.component';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {
  modalController = inject(ModalController);
  firebaseService = inject(FirebaseService);
  encargado: Encargado[] = [];

  constructor() {
    this.cargarEncargado();
  }

  cargarEncargado() {
    this.firebaseService.getEncargado().subscribe((encargado) => {
      this.encargado = encargado;
    });
  }

  // Abrir modal para agregar plato
  async abrirModalAgregarEncargado() {
    const modal = await this.modalController.create({
      component: AddworkerComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      // Recargar los platos si se agregó uno nuevo
      this.cargarEncargado();
    }
  }

  // Eliminar plato
  async eliminarEncargado(id: string) {
    try {
      await this.firebaseService.deleteEncargado(id);
      // La lista se actualizará automáticamente por la suscripción
    } catch (error) {
      console.error('Error al eliminar el Encargado:', error);
    }
  }
  ngOnInit() {}
}
