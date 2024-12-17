import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Adelanto, Evento } from 'src/app/interfaces/eventos.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';
import { Toast } from '@capacitor/toast';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  firebaseService = inject(FirebaseService);
  alertController = inject(AlertController);
  eventos: Evento[] = [];
  adelanto: Adelanto[] = [];
  selectedDate: string | null = null;

  constructor() {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedDate = params['date'];
      this.loadEventos();
    });
  }

  loadEventos() {
    this.firebaseService.getEventos().subscribe((eventos) => {
      if (this.selectedDate) {
        this.eventos = eventos.filter(
          (evento) => evento.fecha === this.selectedDate
        );
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
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarEvento(evento);
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarEvento(evento: Evento) {
    try {
      await this.firebaseService.deleteEvento(evento.id);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'No se pudo eliminar el evento. Por favor, intenta nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  ////////////////////// Generación y manejo del PDF //////////////////////

  async generatePDF(evento: Evento) {
    try {
      const logoBase64 = await this.cargarImagenBase64(
        'assets/images/light.jpg'
      );
      const doc = new jsPDF();
      const fechaActual = new Date().toLocaleDateString();

      const numeroCotizacion =
        await this.firebaseService.obtenerSiguienteNumeroCotizacion();

      doc.addImage(logoBase64, 'PNG', 10, 10, 50, 30); // Coordenadas (x, y) y tamaño (ancho, alto)

      // Encabezado con los datos de la empresa
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Cambia a fuente Helvetica en negrita
      doc.text('DIANA FLOR DE LUZ MOYA TAIPE', 105, 23, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal'); // Cambia a fuente Helvetica en negrita
      doc.text('AV. AYACUCHO NRO 874 - SALINAS - ANDAHUAYLAS', 105, 28, {
        align: 'center',
      });
      doc.setFont('helvetica', 'bold'); // Cambia a fuente Helvetica en negrita
      doc.text('Teléfono: 927371429 - 986561635', 105, 34, { align: 'center' });
      doc.text('E-mail: flor_gml@hotmail.com', 105, 40, { align: 'center' });

      // Línea separadora
      doc.line(10, 45, 200, 45);
      doc.setFont('helvetica', 'normal'); // Cambia a fuente Helvetica en negrita
      // Información del cliente y evento
      doc.setFontSize(10);
      doc.line(155, 18, 155, 38);
      doc.line(190, 18, 190, 38);
      doc.line(155, 18, 190, 18);
      doc.line(155, 38, 190, 38);

      doc.setFont('helvetica', 'bold'); // Cambia a fuente Helvetica en negrita
      doc.text(`COTIZACIÓN Nº:`, 158, 25);
      doc.text(`C001-${numeroCotizacion.toString().padStart(5, '0')}`, 163, 30);
      doc.text(`RUC: 10453980621`, 157, 35);
      doc.setFont('helvetica', 'normal'); // Cambia a fuente Helvetica en negrita

      doc.text(`FECHA EVENTO:`, 125, 50);
      doc.text(`${evento.fecha}`, 160, 50);
      doc.line(160, 51, 185, 51);

      doc.text(`FECHA:`, 20, 50);
      doc.text(`${fechaActual}`, 50, 50);
      doc.line(50, 51, 75, 51);

      doc.text(`SEÑOR(ES):`, 20, 55);
      doc.text(`${evento.cliente}`, 50, 55);
      doc.line(50, 56, 75, 56);

      doc.text(`TELÉFONO:`, 125, 55);
      doc.text(`${evento.numCliente}`, 160, 55);
      doc.line(160, 56, 185, 56);

      doc.text(`TIP. EVE.:`, 20, 60);
      doc.text(`${evento.tipoEvento}`, 50, 60);
      doc.line(50, 61, 75, 61);

      doc.text(`N° INVITADOS:`, 20, 65);
      doc.text(`${evento.cantidadPersonas}`, 50, 65);
      doc.line(50, 66, 75, 66);

      // Línea separadora
      doc.line(10, 76, 200, 76);

      // Tabla de detalles
      let startY = 75;
      doc.setFontSize(10);
      doc.text('CANTIDAD', 15, startY);
      doc.text('DESCRIPCIÓN', 100, startY);
      startY += 5;

      doc.setFont('helvetica', 'bold');

      // Descripción del plato y adicionales
      const platoNombre =
        evento.platoNombre?.toUpperCase() || 'PLATO NO ESPECIFICADO';
      const adicionales = evento.adicional.map((a) => a.nombre.toUpperCase());
      const adicionalesPorLinea = 4;

      // Primera línea: plato + primeros 3 adicionales
      const primerosAdicionales = adicionales
        .slice(0, adicionalesPorLinea)
        .join(' // ');
      doc.text(`${evento.cantidadPersonas}`, 20, startY);
      doc.text(`${platoNombre} // ${primerosAdicionales}`, 50, startY);
      startY += 5;

      // Continuar con los adicionales restantes en bloques de 3
      for (
        let i = adicionalesPorLinea;
        i < adicionales.length;
        i += adicionalesPorLinea
      ) {
        const grupo = adicionales
          .slice(i, i + adicionalesPorLinea)
          .join(' // ');
        doc.text(grupo, 50, startY);
        startY += 5;
      }


      evento.extras.forEach((extra) => {
        doc.line(10, startY-3, 200, startY-3);
        doc.text(`${extra.cantidad}`, 20, startY);
        doc.text(`${extra.nombre.toUpperCase()}`, 50, startY);

        startY += 5;
      });

      // Total general
      startY += 5;
      doc.setFontSize(12);
      doc.text(`TOTAL: S/. ${evento.precioEvento.toFixed(2)}`, 150, startY);

      doc.setFont('helvetica', 'normal');

      // Términos y condiciones
      startY += 0;
      doc.setFontSize(10);
      doc.text('TÉRMINOS Y CONDICIONES:', 20, startY);
      doc.setFontSize(8);
      const condiciones = [
        '1. El cliente deberá abonar la totalidad del monto pactado antes de realizarse el evento.',
        '2. Si el cliente suspende o cancela el evento, no hay opción a devolución de adelantos.',
        '3. Los detalles o condiciones no estipuladas en el presente contrato serán resueltas a criterio de la empresa.',
        '4. El presente documento significa la aceptación de las condiciones previamente pactadas.',
      ];
      condiciones.forEach((cond, index) => {
        doc.text(cond, 20, startY + 5 + index * 5);
      });

      // Notas u observaciones
      startY += 30;
      doc.setFontSize(10);
      doc.text('NOTA U OBSERVACIÓN:', 20, startY);
      doc.setFontSize(8);
      const observaciones = [
        'SE CONSIDERA UN PANEL BÁSICO CON DOS NOMBRES COMO CORTESÍA.',
        'COSTOS DE BEBIDAS: *VINO TACAMA BOTELLA 700ML = 35.00',
        '*PISCO OCCUJAJE 700ML = 45.00 *CERVEZA = 9.00 *GASEOSA DE 2.5 LT = 13.00',
        '*AGUA MINERAL 2 LT = 7.00',
      ];
      observaciones.forEach((obs, index) => {
        doc.text(obs, 20, startY + 5 + index * 5);
      });

      const info = await Device.getInfo();

      if (info.platform === 'web') {
        doc.save(
          `cotizacion_C001-${numeroCotizacion.toString().padStart(5, '0')}.pdf`
        );
      } else if (info.platform === 'android' || info.platform === 'ios') {
        const pdfBase64 = doc.output('datauristring');
        const base64Data = pdfBase64.split(',')[1]; // Separate base64 data
        const fileName = `cotizacion_C001-${numeroCotizacion
          .toString()
          .padStart(5, '0')}.pdf`;

        try {
          const permissionStatus = await Filesystem.checkPermissions();
          console.log('Filesystem Permissions:', permissionStatus);

          console.log('Intentando escribir archivo:', fileName);
          console.log('Longitud de base64:', base64Data.length);

          const writeResult = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Documents,
          });

          console.log('Resultado de escritura:', writeResult);

          const fileUri = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Documents,
          });

          console.log('URI del archivo:', fileUri);

          await Toast.show({
            text: `Archivo guardado correctamente en Documentos como ${fileName}.`,
            duration: 'long',
          });

          await Share.share({
            title: `Cotización C001-${numeroCotizacion
              .toString()
              .padStart(5, '0')}`,
            text: 'Aquí está tu cotización.',
            url: fileUri.uri,
            dialogTitle: 'Compartir cotización:',
          });
        } catch (shareError) {
          console.error('Error al compartir:', shareError);
          const errorMessage =
            shareError instanceof Error
              ? shareError.message
              : JSON.stringify(shareError);

          await Toast.show({
            text: `Error al compartir: ${errorMessage}`,
            duration: 'long',
          });
        }
      } else {
        console.warn('PDF sharing not supported on this platform');
        await Toast.show({
          text: 'No se puede compartir el PDF en esta plataforma.',
          duration: 'long',
        });
      }
    } catch (error) {
      console.error('Error general al generar el PDF:', error);
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);

      await Toast.show({
        text: `Error general: ${errorMessage}`,
        duration: 'long',
      });
    }
  }

  async cargarImagenBase64(ruta: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = ruta;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
    });
  }

  imprimirCotizacion() {
    for (let evento of this.eventos) {
      this.generatePDF(evento);
    }
  }

  editarEvento(evento: Evento) {
    this.router.navigate(['/event-edit', evento.fecha], {
      queryParams: { evento: JSON.stringify(evento) },
    });
  }

  calcularSaldo(evento: Evento): number {
    // Asegúrate de que adelanto sea un arreglo
    const adelantos = Array.isArray(evento.adelanto) ? evento.adelanto : [];

    // Suma la propiedad numérica específica de cada adelanto
    const totalAdelantos = adelantos.reduce(
      (sum, adelanto) => sum + (adelanto.montoAdelanto || 0),
      0
    );

    return evento.precioEvento - totalAdelantos;
  }

  tieneAdelantos(evento: Evento): boolean {
    return evento.adelanto.length > 0;
  }

  async pendientesOnDate() {
    const selectedDate = this.selectedDate; // Obtiene la fecha seleccionada
    if (selectedDate) {
      // Redirige a la página de pendientes con la fecha como parámetro
      this.router.navigate(['/pendientes'], {
        queryParams: { date: selectedDate },
      });
    }
  }
}
