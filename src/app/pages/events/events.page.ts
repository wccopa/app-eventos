import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from 'src/app/interfaces/eventos.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';
import { Plato } from 'src/app/interfaces/plato.module';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  firebaseService = inject(FirebaseService);
  alertController = inject(AlertController);
  eventos: Evento[] = [];
  selectedDate: string | null = null;

  plato: Plato[] = [];z

  constructor() {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'];
      this.loadEventos();
    });
  }

  loadEventos() {
    this.firebaseService.getEventos().subscribe(eventos => {
      if (this.selectedDate) {
        this.eventos = eventos.filter(evento => evento.fecha === this.selectedDate);
      } else {
        this.eventos = eventos;
      }
    });
  }

  async confirmarEliminacion(evento: Evento) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro que deseas eliminar este evento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarEvento(evento);
          }
        }
      ]
    });
  
    await alert.present();
  
    await alert.onDidDismiss();
    const buttonToFocus = document.getElementById('some-button');
    buttonToFocus?.focus();
  }

  async eliminarEvento(evento: Evento) {
    try {
      await this.firebaseService.deleteEvento(evento.id);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo eliminar el evento. Por favor, intenta nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  verEvento(evento: Evento) {
    this.router.navigate(['/details'], {
      queryParams: { date: evento.fecha }
    })
  }

  calcularSaldo(evento: Evento): number {
    const totalAdelantado = evento.adelanto.reduce((acc, adelanto) => acc + adelanto.montoAdelanto, 0);
    return evento.precioEvento - totalAdelantado;
  }
  
  tieneAdelantos(evento: Evento): boolean {
    return evento.adelanto.length > 0;
  }

  

  
}