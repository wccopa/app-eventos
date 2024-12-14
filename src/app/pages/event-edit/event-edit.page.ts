import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Adelanto, Adicional, Evento } from 'src/app/interfaces/eventos.module';
import { Extra } from 'src/app/interfaces/extras.module';
import { Plato } from 'src/app/interfaces/plato.module';
import { AdelantoService } from 'src/app/services/adelanto.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.page.html',
  styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit {
  adelantoService = inject(AdelantoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  firebaseService = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  alertController = inject(AlertController);
  toastController = inject(ToastController);
  modalService = inject(ModalService);

  eventForm: FormGroup;
  eventoOriginal: Evento; // Para guardar el evento original
  fechaSeleccionada: string;
  platos: Plato[] = [];
  adelanto: Adelanto[] = [];
  adicional: Adicional[] = []
  extras: Extra[] = []

  horas = Array.from({ length: 24 }, (_, i) => {
    const hora = i.toString().padStart(2, '0');
    return `${hora}:00`;
  });

  totalAdelanto: number = 0; // Nuevo campo para el total acumulado del adelanto

  constructor() {
    this.adelanto = this.adelantoService.getAdelantos();

    this.eventForm = this.formBuilder.group({
      tipoEvento: ['', Validators.required],
      plato: ['', Validators.required],
      cantidadPersonas: [null, [Validators.required, Validators.min(1)]],
      precioEvento: [null, [Validators.required, Validators.min(1)]],
      hora: ['', Validators.required],
      cliente: [''], // Agrega estos campos
      numCliente: [''],
      adicional: [[]],
      extras: [[]],
      adelanto: [0],
    });
  }

  ngOnInit() {
    this.loadAdicionales();

    if (!this.adelanto) {
      this.adelanto = [];
    }

    this.route.queryParams.subscribe((params) => {
      if (params['evento']) {
        this.eventoOriginal = JSON.parse(params['evento']);
        this.fillForm(this.eventoOriginal);
      }
    });

    this.route.params.subscribe((params) => {
      this.fechaSeleccionada = params['fecha'];
    });

    this.loadPlatos();

    // Cargar los adelantos desde Firebase en caso de que falten al recargar el evento
    this.loadAdelantos();
  }


  private loadAdicionales() {
    // Aquí estamos recuperando los adicionales de Firebase o el servicio
    if (this.eventoOriginal && this.eventoOriginal.adicional) {
      this.adicional = this.eventoOriginal.adicional;
    } else {
      // Si no hay adicionales, inicializamos con un array vacío
      this.adicional = [];
    }
  }
  
  private loadAdelantos() {
    // Aquí debes asegurarte de recuperar los adelantos desde Firebase o el estado local
    // Si el evento ya tiene adelantos, los asignas directamente al arreglo `adelanto`
    if (this.eventoOriginal && this.eventoOriginal.adelanto) {
      this.adelanto = this.eventoOriginal.adelanto;
      this.totalAdelanto = this.adelanto.reduce(
        (acc, a) => acc + a.montoAdelanto,
        0
      );
    }
    
  }

  private fillForm(evento: Evento) {
    this.eventForm.patchValue({
      tipoEvento: evento.tipoEvento,
      plato: evento.platoNombre,
      cantidadPersonas: evento.cantidadPersonas,
      precioEvento: evento.precioEvento,
      hora: evento.hora,
      cliente: evento.cliente || '',
      numCliente: evento.numCliente || '',
      adicional: evento.adicional || [], // No sobrescribir los adicionales
      extras: evento.extras || [], // Asegurarse de no perder los extras
      adelanto: evento.adelanto || [],
    });

    this.extras = evento.extras || [];

    this.adicional = evento.adicional || [];
    this.totalAdelanto = evento.adelanto
      ? evento.adelanto.reduce((acc, a) => acc + a.montoAdelanto, 0)
      : 0;
  }

  private loadPlatos() {
    this.firebaseService.getPlatos().subscribe((platos) => {
      this.platos = platos;
    });
  }

  async abrirModalCantidad() {
    const cantidad = await this.modalService.openInputModal<number>({
      header: 'Cantidad de Personas',
      type: 'number',
      placeholder: 'Ingrese la cantidad',
      minValue: 1,
    });

    if (cantidad !== null) {
      this.eventForm.get('cantidadPersonas').setValue(cantidad);
    }
  }

  async abrirModalPrecio() {
    const precio = await this.modalService.openInputModal<number>({
      header: 'Precio del Evento',
      type: 'number',
      placeholder: 'Ingrese el precio',
      minValue: 1,
    });

    if (precio !== null) {
      this.eventForm.get('precioEvento').setValue(precio);
    }
  }

  adelantosChange = new EventEmitter<Adelanto[]>();

  async agregarAdelanto() {
    const nuevoAdelanto = await this.modalService.agregarAdelanto();

    if (nuevoAdelanto) {
      // Obtener la fecha actual y formatearla como dd/mm/yyyy
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString('en-EN'); // 'es-ES' para formato día/mes/año (dd/mm/yyyy)

      // Asignar la fecha formateada al adelanto
      nuevoAdelanto.fechaAdelanto = fechaFormateada; // Ahora es un string en formato dd/mm/yyyy

      // Agregar el adelanto al array
      this.adelanto.push(nuevoAdelanto);

      // Actualizar el servicio con los nuevos adelantos
      this.adelantoService.setAdelantos(this.adelanto);

      // Calcular el total acumulado de adelantos
      this.totalAdelanto = this.adelanto.reduce(
        (acc, adelanto) => acc + adelanto.montoAdelanto,
        0
      );
      this.adelantosChange.emit(this.adelanto);
    }
  }

  // Método para agregar un nuevo adicional
  async agregarAdicional() {
    const nombre = await this.modalService.openInputModal<string>({
      header: 'Nuevo Adicional',
      type: 'text',
      placeholder: 'Ingrese el nombre del adicional',
    });
  
    if (nombre) {
      // Agregar el nuevo adicional sin eliminar los anteriores
      this.adicional = [...this.adicional, { nombre }];
      // Actualizar el formulario para reflejar los cambios
      this.eventForm.get('adicional').setValue(this.adicional);
    }
  }
  
  eliminarAdicional(index: number) {
    this.adicional.splice(index, 1);
    this.eventForm.get('adicional').setValue(this.adicional);
  }
//////////extras///
async agregarExtra() {
  // Usamos el método del modalService para obtener el extra
  const extra = await this.modalService.agregarExtra();

  if (extra) {
    // Obtenemos los valores actuales de extras en el formulario
    const extrasActualizados = [...this.eventForm.get('extras').value, extra];

    // Actualizamos el campo de 'extras' en el formulario
    this.eventForm.get('extras').setValue(extrasActualizados);
  }
}



eliminarExtra(index: number) {
  // Eliminar el extra específico
  this.extras.splice(index, 1);
  // Actualizamos el formulario para reflejar el cambio
  this.eventForm.get('extras').setValue(this.extras);
}


async guardarCambios() {
  if (this.eventForm.valid) {
    const eventoActualizado: Evento = {
      ...this.eventoOriginal,
      ...this.eventForm.value,
      fecha: this.fechaSeleccionada,
      platoId:
        this.platos.find(
          (plato) => plato.nombre === this.eventForm.get('plato').value
        )?.id || this.eventoOriginal.platoId,
      platoNombre:
        this.platos.find(
          (plato) => plato.nombre === this.eventForm.get('plato').value
        )?.nombre || this.eventoOriginal.platoNombre,
      adelanto: this.adelanto,
      adicional: [...this.adicional],  // Asegurarnos de que los adicionales se mantengan correctamente
    };

    try {
      await this.firebaseService.updateEvento(
        this.eventoOriginal.id,
        eventoActualizado
      );
      await this.mostrarToast('Evento actualizado exitosamente');
      this.router.navigate(['/details'], { queryParams: { date: this.fechaSeleccionada } });
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      this.mostrarToast('Error al actualizar el evento', 'danger');
    }
  } else {
    const camposInvalidos = Object.keys(this.eventForm.controls).filter(
      (key) => this.eventForm.controls[key].invalid
    );
    console.error('Campos inválidos:', camposInvalidos);
    this.mostrarToast(
      'Por favor, complete los campos requeridos: ' +
        camposInvalidos.join(', '),
      'danger'
    );
  }
}

  private async mostrarToast(
    mensaje: string,
    color: 'success' | 'danger' = 'success'
  ) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }
}
