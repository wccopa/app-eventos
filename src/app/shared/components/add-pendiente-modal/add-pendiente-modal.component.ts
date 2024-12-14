import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-pendiente-modal',
  templateUrl: './add-pendiente-modal.component.html',
  styleUrls: ['./add-pendiente-modal.component.scss'],
})
export class AddPendienteModalComponent {
  pendienteForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.pendienteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submit() {
    if (this.pendienteForm.valid) {
      const pendienteData = this.pendienteForm.value;
      this.modalController.dismiss(pendienteData);
    }
  }
}
