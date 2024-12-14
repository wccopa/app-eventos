import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Plato } from 'src/app/interfaces/plato.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddfoodsComponent } from 'src/app/shared/components/addfoods/addfoods.component';

@Component({
  selector: 'app-foodlist',
  templateUrl: './foodlist.page.html',
  styleUrls: ['./foodlist.page.scss'],
})
export class FoodlistPage implements OnInit {

  modalController = inject(ModalController);
  firebaseService = inject(FirebaseService);
  platos: Plato[] = [];

  constructor() {
    this.cargarPlatos();
   }

   cargarPlatos() {
    this.firebaseService.getPlatos().subscribe(platos => {
      this.platos = platos;
    });
  } 


  // Abrir modal para agregar plato
  async abrirModalAgregarPlato() {
    const modal = await this.modalController.create({
      component: AddfoodsComponent,
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      // Recargar los platos si se agregó uno nuevo
      this.cargarPlatos();
    }
  }

  // Eliminar plato
  async eliminarPlato(id: string) {
    try {
      await this.firebaseService.deletePlato(id);
      // La lista se actualizará automáticamente por la suscripción
    } catch (error) {
      console.error('Error al eliminar el plato:', error);
    }
  }
  ngOnInit() {}

}
