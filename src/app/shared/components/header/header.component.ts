import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

interface RouteData {
  title?: string; // Definimos title como opcional
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  title: string;

  constructor() {}

  ngOnInit() {
    // Suscribirse a los cambios de la ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.activatedRoute.root.firstChild;

        // Asegúrate de que currentRoute esté definido y que tenga datos
        if (currentRoute?.snapshot.data) {
          const data: RouteData = currentRoute.snapshot.data;
          this.title = data.title || '';
        } else {
          this.title = ''; // Valor por defecto si no hay datos
        }
      });
  }
   
}
