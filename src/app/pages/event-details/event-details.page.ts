import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Plato } from 'src/app/interfaces/plato.module';
import { AlertController, ToastController } from '@ionic/angular';
import { Extra } from 'src/app/interfaces/extras.module';
import { Adelanto, Adicional, Evento } from 'src/app/interfaces/eventos.module';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  modalService = inject(ModalService);
  alertController = inject(AlertController);
  route = inject(ActivatedRoute);
  firebaseService = inject(FirebaseService);
  toastController = inject(ToastController);
  router = inject(Router);

  cantidadPersonas: number | null = null;
  cliente: string | null = null;
  numCliente: string | null = null;
  precioevento: number | null = null;
  adelanto?: Adelanto[] = []; 
  horaSeleccionada: string = '';
  fechaSeleccionada: string;
  tipoEventoSeleccionado: string = '';
  platoSeleccionado: string = '';
  platos: Plato[] = [];
  adicional: Adicional[] = [];
  extras: Extra[] = [];
  numMesas: number | null = null;
  numSillas: number | null = null;

  constructor() {
    this.loadPlatos();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fechaSeleccionada = params['fecha'];
    });
  }

  horas = Array.from({ length: 24 }, (_, i) => {
    const hora = i.toString().padStart(2, '0');
    return `${hora}:00`;
  });

  onHoraChange(event: any) {
    this.horaSeleccionada = event.detail.value;
  }

  private loadPlatos() {
    this.firebaseService.getPlatos().subscribe((platos) => {
      this.platos = platos;
    });
  }

  onTipoEventoChange(event: any) {
    if (event && event.detail) {
      this.tipoEventoSeleccionado = event.detail.value;
      console.log('Tipo de evento seleccionado:', this.tipoEventoSeleccionado);
    }
  }

  onPlatoChange(event: any) {
    if (event && event.detail) {
      this.platoSeleccionado = event.detail.value;
      console.log('Plato seleccionado:', this.platoSeleccionado);
    }
  }

  ////////////////////modal cantidad de personas///////////////////////
  async abrirModalCantidad() {
    const cantidad = await this.modalService.openInputModal<number>({
      header: 'Cantidad de Personas',
      type: 'number',
      placeholder: 'Ingrese la cantidad',
      minValue: 1,
    });

    if (cantidad !== null) {
      this.cantidadPersonas = cantidad;
    }
  }

  ////////////////////modal precio del evento///////////////////////
  async abrirModalPrecio() {
    const precio = await this.modalService.openInputModal<number>({
      header: 'Precio del Evento',
      type: 'number',
      placeholder: 'Ingrese el precio',
      minValue: 1,
    });

    if (precio !== null) {
      this.precioevento = precio;
    }
  }

  ////////////////////modal cantidad de personas///////////////////////
  async abrirModalMesas() {
    const numMesas = await this.modalService.openInputModal<number>({
      header: 'Cantidad de Mesas',
      type: 'number',
      placeholder: 'Ingrese la cantidad',
      minValue: 1,
    });

    if (numMesas !== null) {
      this.numMesas = numMesas;
    }
  }

  ////////////////////modal cantidad de personas///////////////////////
  async abrirModalSillas() {
    const numSillas = await this.modalService.openInputModal<number>({
      header: 'Cantidad de Sillas',
      type: 'number',
      placeholder: 'Ingrese la cantidad',
      minValue: 1,
    });

    if (numSillas !== null) {
      this.numSillas = numSillas;
    }
  }
  //////////adicionales////////
  adicionalchange = new EventEmitter<Adicional[]>();

  async agregarAdicional() {
    const nuevoAdicional = await this.modalService.agregarAdicional();
    if (nuevoAdicional) {
      this.adicional.push(nuevoAdicional);
      this.adicionalchange.emit(this.adicional);
    }
  }

  eliminarAdicional(adicional: Adicional) {
    const nuevosAdicionales = this.adicional.filter(
      (a) => a.id !== adicional.id
    );
    this.adicional = nuevosAdicionales;
    this.adicionalchange.emit(nuevosAdicionales);
  }

  ////////////////////modal adelanto del evento///////////////////////
  async abrirModalAdelanto() {
    const alert = await this.alertController.create({
      header: 'Adelanto',
      cssClass: 'custom-alert',
      inputs: [
        {
          type: 'number',
          placeholder: 'Ingrese el monto',
          min: 1,
          name: 'adelanto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => {
            if (data.adelanto && data.adelanto > 0) {
              const fechaActual = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
              // Guardamos el adelanto en un arreglo, asegurándonos de que el monto es un número
              this.adelanto.push({
                montoAdelanto: Number(data.adelanto),
                fechaAdelanto: fechaActual,
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  ////////////////////modal cliente del evento///////////////////////
  async abrirModalCliente() {
    const cliente = await this.modalService.openInputModal<string>({
      header: 'Cliente',
      type: 'text',
      placeholder: 'Ingrese el cliente',
    });

    if (cliente !== null) {
      this.cliente = cliente;
    }
  }

  ////////////////////modal numero cliente ///////////////////////
  async abrirModalNumeroCliente() {
    const alert = await this.alertController.create({
      header: 'Teléfono',
      cssClass: 'custom-alert',
      inputs: [
        {
          type: 'number',
          placeholder: 'Ingrese el Teléfono (9 dígitos)',
          name: 'numCliente',
          attributes: {
            pattern: '[0-9]{9}',
            maxlength: '9',
            minlength: '9',
          },
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => {
            const telefono = data.numCliente ? data.numCliente.trim() : '';

            if (telefono.length !== 9 || !/^\d{9}$/.test(telefono)) {
              this.mostrarErrorTelefono();
              return false;
            }

            this.numCliente = telefono;
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para mostrar mensaje de error
  mostrarErrorTelefono() {
    const errorAlert = this.alertController.create({
      header: 'Error',
      message: 'Por favor, ingrese un número de celular válido de 9 dígitos.',
      buttons: ['Aceptar'],
    });
    errorAlert.then((alert) => alert.present());
  }

  private async mostrarToast(
    mensaje: string,
    color: 'success' | 'danger' = 'success'
  ) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'middle',
    });
    toast.present();
  }

  private validarFormulario(): boolean {
    console.log('Validando formulario...');

    if (
      !this.tipoEventoSeleccionado ||
      this.tipoEventoSeleccionado.trim() === ''
    ) {
      this.mostrarToast('Seleccione el tipo de evento', 'danger');
      return false;
    }
    if (!this.platoSeleccionado || this.platoSeleccionado.trim() === '') {
      this.mostrarToast('Seleccione un plato', 'danger');
      return false;
    }
    if (!this.cantidadPersonas || this.cantidadPersonas <= 0) {
      this.mostrarToast('Ingrese la cantidad de personas', 'danger');
      return false;
    }
    if (!this.precioevento || this.precioevento <= 0) {
      this.mostrarToast('Ingrese el precio del evento', 'danger');
      return false;
    }
    if (!this.horaSeleccionada || this.horaSeleccionada.trim() === '') {
      this.mostrarToast('Seleccione una hora', 'danger');
      return false;
    }
    if (!this.cliente || this.cliente.trim() === '') {
      this.mostrarToast('Ingrese nombre del cliente', 'danger');
      return false;
    }
    if (!this.numCliente || this.numCliente.trim() === '') {
      this.mostrarToast('Ingrese el numero del cliente', 'danger');
      return false;
    }

    return true;
  }

  async guardarEvento() {
    console.log('Iniciando guardado de evento...');
    if (!this.validarFormulario()) {
      console.log('Validación fallida');
      return;
    }

    const nuevoEvento: Evento = {
      fecha: this.fechaSeleccionada,
      tipoEvento: this.tipoEventoSeleccionado,
      cliente: this.cliente,
      numCliente: this.numCliente,
      platoId: this.platoSeleccionado,
      platoNombre:
        this.platos.find((plato) => plato.nombre === this.platoSeleccionado)
          ?.nombre || '',
      adicional: this.adicional,
      cantidadPersonas: this.cantidadPersonas,
      precioEvento: this.precioevento,
      hora: this.horaSeleccionada,
      extras: this.extras,
      adelanto: this.adelanto, // Adelanto es ahora un arreglo
      estado: 'pendiente',
      numMesas: this.numMesas,
      numSillas: this.numSillas,
    };

    try {
      await this.firebaseService.addEvento(nuevoEvento);
      await this.mostrarToast('Evento guardado exitosamente');
      this.router.navigate(['/details'], {
        queryParams: { date: this.fechaSeleccionada },
      });
    } catch (error) {
      this.mostrarToast('Error al guardar el evento', 'danger');
    }
  }

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
    const nuevosExtras = this.extras.filter((e) => e.id !== extra.id);
    this.extras = nuevosExtras;
    this.extrasChange.emit(nuevosExtras);
  }

  get adelantoFechas() {
    return this.adelanto.map((a) => a.fechaAdelanto).join(' ');
  }

  obtenerMontoYFechaAdelanto(): string {
    if (this.adelanto?.length > 0) {
      const montos = this.adelanto.map((a) => a.montoAdelanto).join(' + ');
      const fechas = this.adelanto.map((a) => a.fechaAdelanto).join(' / ');
      return `${montos} - ${fechas}`;
    }
    return '- -'; // Si no hay adelantos
  }

  eliminarAdelanto(adelanto: Adelanto) {
    this.adelanto = this.adelanto.filter((a) => a !== adelanto);
  }
}
