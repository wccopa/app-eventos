import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Extra } from 'src/app/interfaces/extras.module';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss'],
})
export class ExtrasComponent  implements OnInit {

  alertController = inject(AlertController);
  modalService = inject(ModalService);

  extras: Extra[] = [];
  extrasChange = new EventEmitter<Extra[]>();

  async agregarExtra() {
    const nuevoExtra = await this.modalService.agregarExtra();
    if (nuevoExtra) {
      const nuevosExtras = [...this.extras, nuevoExtra];
      this.extras = nuevosExtras;
      this.extrasChange.emit(nuevosExtras);
    }
  }

  eliminarExtra(extra: Extra) {
    const nuevosExtras = this.extras.filter(e => e.id !== extra.id);
    this.extras = nuevosExtras;
    this.extrasChange.emit(nuevosExtras);
  }

  constructor() { }

  ngOnInit() {}

}
