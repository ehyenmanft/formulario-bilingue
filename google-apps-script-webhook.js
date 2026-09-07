/**
 * CÓDIGO PARA GOOGLE APPS SCRIPT (Vinculado a tu Google Sheet)
 * 
 * Soporta:
 * 1. Carga de comprobantes e imágenes directamente a GOOGLE DRIVE
 * 2. Inserción del enlace de Google Drive en la hoja de respuestas (idéntico a Google Forms)
 * 3. Exportación de preguntas de tu formulario existente
 */

const SPREADSHEET_ID = '11OU8BSOkeMVAOnJze2U2fmBE2VGYIqDFmeMgVS7MUig';
const TARGET_GID = '1231979328';
const FORM_ORIGINAL_ID = '1jbbZ9xNVWdVs_n7eq1Bs19FZfjzt7hFaQo-GLlzjaas';

// Nombre de la carpeta en Google Drive donde se guardarán los comprobantes
const DRIVE_FOLDER_NAME = 'Comprobantes Formulario Web';

/**
 * Webhook POST: Recibe datos y archivos Base64 desde la web
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 1. Obtener la pestaña por GID
    let sheet = null;
    const sheets = ss.getSheets();
    for (let i = 0; i < sheets.length; i++) {
      if (String(sheets[i].getSheetId()) === TARGET_GID) {
        sheet = sheets[i];
        break;
      }
    }
    if (!sheet) sheet = ss.getSheets()[0];

    // 2. Encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      const headers = ['Marca temporal', 'Idioma'];
      if (data.respuestas && Array.isArray(data.respuestas)) {
        data.respuestas.forEach(r => headers.push(r.titulo || r.id));
      }
      sheet.appendRow(headers);
    }

    // 3. Obtener o crear la carpeta en Google Drive
    let driveFolder = null;
    const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    if (folders.hasNext()) {
      driveFolder = folders.next();
    } else {
      driveFolder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    }

    // 4. Procesar respuestas y subir archivos a Google Drive
    const fila = [new Date(), data.idioma || 'ES'];

    if (data.respuestas && Array.isArray(data.respuestas)) {
      data.respuestas.forEach(r => {
        // Si es un archivo (comprobante / imagen)
        if (r.tipo === 'file' && r.archivo && r.archivo.base64) {
          try {
            const bytes = Utilities.base64Decode(r.archivo.base64);
            const nombreLimpio = (r.archivo.nombre || 'comprobante_' + new Date().getTime())
              .replace(/[^a-zA-Z0-9._-]/g, '_');
            const blob = Utilities.newBlob(bytes, r.archivo.tipoMime || 'image/jpeg', nombreLimpio);
            
            // Crear el archivo en Google Drive
            const nuevoArchivoDrive = driveFolder.createFile(blob);
            
            // Habilitar acceso de visualización con el enlace
            nuevoArchivoDrive.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            
            // Guardar el enlace de Google Drive en la celda (como lo hace Google Forms)
            fila.push(nuevoArchivoDrive.getUrl());
          } catch (errArchivo) {
            fila.push('Error al subir comprobante: ' + errArchivo.toString());
          }
        } else {
          // Campo regular de texto, opción, fecha, etc.
          let val = r.valor;
          if (Array.isArray(val)) val = val.join(', ');
          fila.push(val !== undefined && val !== null ? val : '');
        }
      });
    }

    // Insertar la fila en la hoja de cálculo
    sheet.appendRow(fila);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Datos y comprobante guardados exitosamente' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'online', service: 'Google Sheets & Drive Webhook' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función para exportar las preguntas exactas de tu formulario original
 */
function exportarEstructuraParaLaWeb() {
  const form = FormApp.openById(FORM_ORIGINAL_ID);
  const items = form.getItems();
  const resultado = [];

  items.forEach((item, index) => {
    const tipo = item.getType();
    const titulo = item.getTitle();
    if (!titulo && tipo === FormApp.ItemType.PAGE_BREAK) return;

    let tipoWeb = 'text';
    let opciones = [];
    let requerido = false;

    switch (tipo) {
      case FormApp.ItemType.FILE_UPLOAD:
        tipoWeb = 'file';
        break;
      case FormApp.ItemType.TEXT:
        tipoWeb = 'text';
        requerido = item.asTextItem().isRequired();
        break;
      case FormApp.ItemType.PARAGRAPH_TEXT:
        tipoWeb = 'textarea';
        requerido = item.asParagraphTextItem().isRequired();
        break;
      case FormApp.ItemType.MULTIPLE_CHOICE:
        tipoWeb = 'radio';
        const mc = item.asMultipleChoiceItem();
        requerido = mc.isRequired();
        opciones = mc.getChoices().map(c => c.getValue());
        break;
      case FormApp.ItemType.CHECKBOX:
        tipoWeb = 'checkbox';
        const cb = item.asCheckboxItem();
        requerido = cb.isRequired();
        opciones = cb.getChoices().map(c => c.getValue());
        break;
      case FormApp.ItemType.LIST:
        tipoWeb = 'select';
        const l = item.asListItem();
        requerido = l.isRequired();
        opciones = l.getChoices().map(c => c.getValue());
        break;
      case FormApp.ItemType.SCALE:
        tipoWeb = 'scale';
        requerido = item.asScaleItem().isRequired();
        break;
      case FormApp.ItemType.DATE:
        tipoWeb = 'date';
        requerido = item.asDateItem().isRequired();
        break;
    }

    resultado.push({
      id: 'q_' + index,
      tipo: tipoWeb,
      requerido: requerido,
      titulo: { es: titulo, en: LanguageApp.translate(titulo, 'es', 'en') },
      ayuda: { es: item.getHelpText() || '', en: item.getHelpText() ? LanguageApp.translate(item.getHelpText(), 'es', 'en') : '' },
      opciones: { es: opciones, en: opciones.map(o => LanguageApp.translate(o, 'es', 'en')) }
    });
  });

  Logger.log('COPIA ESTE JSON Y REEMPLÁZALO EN questions.js:\n' + JSON.stringify(resultado, null, 2));
}
