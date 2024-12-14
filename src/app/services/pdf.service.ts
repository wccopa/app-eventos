import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';
import { Evento } from '../interfaces/eventos.module';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async generarBoleta(evento: Evento) {
    try {
      const doc = new jsPDF();
      const fechaActual = new Date().toLocaleDateString(); // Fecha actual en formato local
      const logoBase64 = await this.cargarImagenBase64('assets/images/light.jpg'); // Cargar logo en base64

      let numeroCotizacion = parseInt(localStorage.getItem('numeroCotizacion') || '0', 10);
      numeroCotizacion++; // Incrementar número de cotización
      localStorage.setItem('numeroCotizacion', numeroCotizacion.toString());

      doc.addImage(logoBase64, 'PNG', 35, 10, 20, 20);

      // Encabezado con datos de la empresa
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DIANA FLOR DE LUZ MOYA TAIPE', 105, 23, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('AV. AYACUCHO NRO 874 - SALINAS - ANDAHUAYLAS', 105, 28, { align: 'center' });
      doc.text('Teléfono: 927371429 - 986561635', 105, 34, { align: 'center' });
      doc.text('E-mail: flor_gml@hotmail.com', 105, 40, { align: 'center' });

      // Línea separadora
      doc.line(10, 45, 200, 45);

      // Detalles de la cotización
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`COTIZACIÓN Nº:`, 158, 25);
      doc.text(`C001-${numeroCotizacion.toString().padStart(5, '0')}`, 163, 30);

      doc.setFont('helvetica', 'normal');
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
      doc.line(10, 70, 200, 70);

      // Tabla de detalles
      let startY = 95;
      doc.setFontSize(10);
      doc.text('ITEM', 15, startY);
      doc.text('DESCRIPCIÓN', 80, startY);
      startY += 5;

      // Plato principal (cantidad = número de personas)
      doc.text(`01`, 17, startY);

      const adicionales = evento.adicional.map((a) => a.nombre);
      const adicionalesPorLinea = 3; // Número de adicionales por línea
      let lineaActualY = startY;

      // Procesar adicionales en bloques de 3
      for (let i = 0; i < adicionales.length; i += adicionalesPorLinea) {
        const grupo = adicionales.slice(i, i + adicionalesPorLinea).join(' + '); // Extraer grupo de 3
        doc.text(`${grupo}`, 50, lineaActualY); // Imprimir el grupo
        lineaActualY += 5; // Avanzar a la siguiente línea para el próximo grupo
      }

      startY += 10;

      // Extras
      let cantidadExtra = 2; // Inicializamos la cantidad de los extras

      evento.extras.forEach((extra) => {
        doc.text(`0${cantidadExtra}`, 15, startY); // Muestra la cantidad secuencial
        doc.text(`${extra.nombre}`, 50, startY);
        startY += 10;
        cantidadExtra++; // Aumenta la cantidad para el siguiente extra
      });

      // Total general
      startY += 10;
      doc.setFontSize(12);
      doc.text(`TOTAL: S/. ${evento.precioEvento.toFixed(2)}`, 150, startY);

      // Términos y condiciones
      startY += 20;
      doc.setFontSize(10);
      doc.text('TÉRMINOS Y CONDICIONES:', 20, startY);
      const condiciones = [
        '1. El cliente deberá abonar la totalidad del monto pactado antes de realizarse el evento.',
        '2. Si el cliente suspende o cancela el evento, no hay opción a devolución de adelantos.',
        '3. Los detalles o condiciones no estipuladas en el presente contrato serán resueltas a criterio de la empresa.',
        '4. El presente documento significa la aceptación de las condiciones previamente pactadas.',
      ];
      condiciones.forEach((cond, index) => {
        doc.text(cond, 20, startY + 10 + index * 10);
      });

      // Notas u observaciones
      startY += 60;
      doc.setFontSize(10);
      doc.text('NOTA U OBSERVACIÓN:', 20, startY);
      const observaciones = [
        'LA PORCIÓN DE CUY SERÁ DE 1/4 (CUY ENTERO POR 4 PERSONAS).',
        'SE CONSIDERA UN PANEL BÁSICO CON DOS NOMBRES COMO CORTESÍA.',
        'COSTOS DE BEBIDAS: *VINO TACAMA BOTELLA 700ML = 35.00',
        '*PISCO OCCUJAJE 700ML = 45.00 *CERVEZA = 9.00 *GASEOSA DE 2.5 LT = 13.00',
        '*AGUA MINERAL 2 LT = 7.00',
      ];
      observaciones.forEach((obs, index) => {
        doc.text(obs, 20, startY + 10 + index * 10);
      });

      const pdfBlob = doc.output('blob');

      const info = await Device.getInfo();
      if (info.platform === 'web') {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      } else if (info.platform === 'android' || info.platform === 'ios') {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);

        reader.onloadend = async () => {
          const base64Data = reader.result?.toString().split(',')[1];
          if (base64Data) {
            const fileName = `boleta_${numeroCotizacion}.pdf`;

            await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents,
            });

            const fileUri = await Filesystem.getUri({
              path: fileName,
              directory: Directory.Documents,
            });

            await Share.share({
              title: 'Compartir Boleta',
              text: 'Aquí está tu boleta de venta electrónica.',
              url: fileUri.uri,
              dialogTitle: 'Compartir con:',
            });
          }
        };
      }
    } catch (error) {
      console.error('Error al generar la boleta:', error);
      await Toast.show({
        text: 'Error al guardar la boleta.',
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
}
