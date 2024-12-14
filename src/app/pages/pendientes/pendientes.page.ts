import { Component, OnInit } from '@angular/core';
import { PendientesService } from 'src/app/services/pendientes.service';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AddPendienteModalComponent } from 'src/app/shared/components/add-pendiente-modal/add-pendiente-modal.component';
import { Pendiente } from 'src/app/interfaces/pendientes.module';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {
  pendientes: Pendiente[] = [];
  fechaSeleccionada: string = ''; 

  constructor(
    private pendientesService: PendientesService,
    private modalController: ModalController,
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
      // Adjust the return type handling based on your service method
      const fechaDoc = await this.pendientesService.getDocumentByFecha(this.fechaSeleccionada);
      
      if (fechaDoc) {
        // Ensure type safety when accessing pendiente
        this.pendientes = fechaDoc.pendiente || []; 
      } else {
        this.pendientes = []; 
      }
    } catch (error) {
      console.error('Error al cargar los pendientes:', error);
    }
  }

  async openAddPendienteModal() {
    const modal = await this.modalController.create({
      component: AddPendienteModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const nuevoPendiente: Pendiente = {
          nombre: data.data.nombre,
          estado: 'incompleto', 
        };
        this.pendientes.push(nuevoPendiente);
        this.guardarPendiente();
      }
    });

    await modal.present();
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

  toggleEstado(pendiente: Pendiente) {
    pendiente.estado = pendiente.estado === 'completado' ? 'incompleto' : 'completado';
    this.guardarPendiente();
  }

  calcularPorcentajeCompletados(): number {
    if (this.pendientes.length === 0) return 0;
    
    const completados = this.pendientes.filter(p => p.estado === 'completado').length;
    return Math.round((completados / this.pendientes.length) * 100);
  }

}