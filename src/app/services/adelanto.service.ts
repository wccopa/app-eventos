import { Injectable } from '@angular/core';
import { Adelanto } from '../interfaces/eventos.module';

@Injectable({
  providedIn: 'root'
})
export class AdelantoService {
  private adelanto: Adelanto[] = [];

  getAdelantos(): Adelanto[] {
    return this.adelanto;
  }

  setAdelantos(adelantos: Adelanto[]): void {
    this.adelanto = adelantos;
  }

  addAdelanto(nuevoAdelanto: Adelanto) {
    this.adelanto.push(nuevoAdelanto);
  }

  constructor() { }
}
