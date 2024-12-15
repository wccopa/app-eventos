import { Component, inject, Inject, OnInit } from '@angular/core';
import { PendientesService } from 'src/app/services/pendientes.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Pendiente } from 'src/app/interfaces/pendientes.module';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {
  alertController = inject(AlertController)
  modalService = inject(ModalService)
  pendientes: Pendiente[] = [];
  fechaSeleccionada: string = ''; 

  constructor(
    private pendientesService: PendientesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fechaSeleccionada = params['date']; 
      if (this.fechaSeleccionada) {
        this.cargarPendientes();
      } else {
        console.log("No se ha seleccionado una fecha válida.");
      }
    });
  }

  async cargarPendientes() {
    try {
      const fechaDoc = await this.pendientesService.getDocumentByFecha(this.fechaSeleccionada);
      
      if (fechaDoc) {
        this.pendientes = fechaDoc.pendiente || []; 
      } else {
        this.pendientes = []; 
      }
    } catch (error) {
      console.error('Error al cargar los pendientes:', error);
    }
  }

  async openAddPendienteModal() {
    const alert = await this.alertController.create({
      header: 'Agregar Pendiente',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del pendiente',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            if (data.nombre && data.nombre.trim() !== '') {
              const nuevoPendiente: Pendiente = {
                nombre: data.nombre.trim(),
                estado: 'incompleto',
              };
              this.pendientes.push(nuevoPendiente);
              await this.guardarPendiente();
            } else {
              console.log('El nombre del pendiente no puede estar vacío.');
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  

  async guardarPendiente() {
    try {
      const fechaDoc = await this.pendientesService.getDocumentByFecha(this.fechaSeleccionada);
      if (fechaDoc) {
        await this.pendientesService.updatePendientesForFecha(fechaDoc.uid!, this.pendientes);
      } else {
        await this.pendientesService.createFechaDocument(this.fechaSeleccionada, this.pendientes);
      }
    } catch (error) {
      console.error('Error al guardar los pendientes:', error);
    }
  }

  async eliminarPendiente(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este pendiente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              this.pendientes.splice(index, 1); // Eliminar pendiente de la lista
              await this.guardarPendiente(); // Actualizar la base de datos
            } catch (error) {
              console.error('Error al eliminar el pendiente:', error);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  

  async toggleEstado(pendiente: Pendiente) {
    pendiente.estado = pendiente.estado === 'completado' ? 'incompleto' : 'completado';
  
    if (pendiente.estado === 'completado') {
      // Abrir el modal para ingresar el precio
      const precio = await this.modalService.openInputModal<number>({
        header: 'Asignar Precio',
        type: 'number',
        placeholder: 'Ingrese el precio',
        minValue: 0.01,
      });
  
      if (precio != null) {
        pendiente.precio = precio; // Asignar el precio al pendiente
        this.guardarPendiente(); // Guardar los cambios
      } else {
        // Si no se ingresó precio, revertir el estado del pendiente
        pendiente.estado = 'incompleto';
      }
    } else {
      // Guardar directamente si el estado cambia a incompleto
      this.guardarPendiente();
    }
  }
  

  calcularPorcentajeCompletados(): number {
    if (this.pendientes.length === 0) return 0;
    
    const completados = this.pendientes.filter(p => p.estado === 'completado').length;
    return Math.round((completados / this.pendientes.length) * 100);
  }

}