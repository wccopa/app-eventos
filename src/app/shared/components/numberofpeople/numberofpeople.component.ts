import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-numberofpeople',
  templateUrl: './numberofpeople.component.html',
  styleUrls: ['./numberofpeople.component.scss'],
})
export class NumberofpeopleComponent implements OnInit {
  
  modalController = inject(ModalController);

  cantidad: number;

  cancelar() {
    this.modalController.dismiss();
  }

  confirmar() {
    if (this.cantidad && this.cantidad > 0) {
      this.modalController.dismiss(this.cantidad);
    }
  }

  constructor() {}

  ngOnInit() {}
}
