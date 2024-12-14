import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Extra } from '../interfaces/extras.module';
import { Adelanto, Adicional } from '../interfaces/eventos.module';

export interface ModalConfig<T> {
  header: string;
  type: 'text' | 'number' | 'tel';
  placeholder: string;
  minValue?: number;
  validation?: {
    pattern?: string;
    maxLength?: number;
    minLength?: number;
  };
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  alertController = inject(AlertController);

  async openInputModal<T extends string | number>(config: ModalConfig<T>): Promise<T | null> {
    const alert = await this.alertController.create({
      header: config.header,
      cssClass: 'custom-alert',
      inputs: [
        {
          type: config.type,
          placeholder: config.placeholder,
          min: config.minValue,
          name: 'value',
          attributes: config.validation
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            if (config.type === 'tel' && config.validation?.pattern) {
              const value = data.value ? data.value.trim() : '';
              const pattern = new RegExp(config.validation.pattern);
              
              if (!pattern.test(value)) {
                this.showError(config.errorMessage || 'Valor inválido');
                return false;
              }
            }

            if (config.type === 'number') {
              return data.value && Number(data.value) > (config.minValue || 0);
            }

            return data.value && data.value.trim() !== '';
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    
    if (result.role === 'cancel' || !result.data?.values?.value) {
      return null;
    }

    return config.type === 'number' 
      ? Number(result.data.values.value) as T
      : result.data.values.value.trim() as T;
  }

  private async showError(message: string) {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Aceptar']
    });
    await errorAlert.present();
  }


  async agregarExtra(): Promise<Extra | null> {
    const nombre = await this.openInputModal<string>({
      header: 'Agregar Extra',
      type: 'text',
      placeholder: ''
    });
    const cantidad = await this.openInputModal<number>({
      header: 'Agregar Cantidad',
      type: 'number',
      placeholder: ''
    });

    if (nombre && cantidad) {
      return {
        nombre,
        cantidad,
        
        // Puedes agregar más propiedades según necesites
        id: Date.now().toString() // Un ID temporal, idealmente usa UUID o algo similar
      };
    }
    
    return null;
  }

  async agregarAdelanto(): Promise<Adelanto | null> {
    const montoAdelanto = await this.openInputModal<number>({
      header: 'Agregar Cantidad',
      type: 'number',
      placeholder: ''
    });

    if (montoAdelanto) {
      return {
        montoAdelanto,
        
        // Puedes agregar más propiedades según necesites
        id: Date.now().toString() // Un ID temporal, idealmente usa UUID o algo similar
      };
    }
    
    return null;
  }


  // agregar adicional

  async agregarAdicional(): Promise<Adicional | null> {
    const nombre = await this.openInputModal<string>({
      header: 'Agregar Adicional',
      type: 'text',
      placeholder: 'Nombre:'
    });

    if (nombre) {
      return {
        nombre,
        // Puedes agregar más propiedades según necesites
        id: Date.now().toString() // Un ID temporal, idealmente usa UUID o algo similar
      };
    }
    
    return null;
  }
  constructor() {}
}
