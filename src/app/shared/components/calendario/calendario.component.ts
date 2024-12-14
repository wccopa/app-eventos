import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/interfaces/eventos.module';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
})
export class CalendarioComponent  implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  eventos: Evento[] = [];
  highlightedDates = [
    {
      date: '',
      textColor: '#800080',
      backgroundColor: '#ffc409'
    }
  ];

  constructor() {}

  ngOnInit() {
    this.loadEventos();
  }

  loadEventos() {
    this.firebaseService.getEventos().subscribe(eventos => {
      this.eventos = eventos;
      this.procesarEventos();
    });
  }

  procesarEventos() {
    this.highlightedDates = this.eventos.map(evento => {
      // Validar que evento.adelanto sea un array, o asignar un array vacío
      const adelantos = Array.isArray(evento.adelanto) ? evento.adelanto : [];
    
      // Calcular el total adelantado de forma segura
      const totalAdelantado = adelantos.reduce((acc, adelanto) => {
        const monto = adelanto?.montoAdelanto ?? 0; // Validar montoAdelanto
        return acc + monto;
      }, 0);
    
      // Calcular el saldo restante
      const saldoRestante = evento.precioEvento - totalAdelantado;
    
      // Determinar el color de fondo
      let backgroundColor = '#ffc409'; // Amarillo por defecto
      if (totalAdelantado > 0) {
        backgroundColor = '#2dd36f'; // Verde si hay adelanto
      }
      if (totalAdelantado === evento.precioEvento) {
        backgroundColor = '#ff0000'; // Rojo si el adelanto cubre el precio total
      }
    
      // Retornar el objeto de estilos para cada fecha
      return {
        date: evento.fecha,
        textColor: '#ffffff',
        backgroundColor: backgroundColor
      };
    });
  }
  
  
  

  async onDateSelect(event: any) {
    const formattedDate = event.detail.value.split('T')[0];
    
    // Verificar si la fecha ya tiene un evento registrado
    const fechaRegistrada = this.eventos.some(evento => evento.fecha === formattedDate);

    if (fechaRegistrada) {
      // Si la fecha ya está registrada, redirige a la página de eventos
      this.router.navigate(['/details'], {
        queryParams: { date: formattedDate }
      });
    } else {
      // Si la fecha no está registrada, redirige a la página de detalles del evento
      this.router.navigate(['/event-details/' + formattedDate]);
    }
  }

}
