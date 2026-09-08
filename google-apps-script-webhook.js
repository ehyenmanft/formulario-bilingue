/**
 * CÓDIGO PARA GOOGLE APPS SCRIPT (Vinculado a tu Google Sheet)
 * 
 * CARACTERÍSTICAS PRINCIPALES:
 * 1. Mapeo inteligente por encabezados: Coloca cada respuesta en su columna exacta
 *    según el título de la pregunta en la fila 1 (sin desfases ni columnas corridas).
 * 2. Guarda el comprobante / recibo en Google Drive ("Comprobantes Formulario Web")
 *    y coloca su enlace público en la columna "Cargue su comprobante de pago".
 * 3. Asigna la marca temporal en la columna de Timestamp y el idioma si la columna existe.
 * 4. No rompe columnas existentes aunque el usuario llene preguntas de forma parcial.
 */

const SPREADSHEET_ID = '11OU8BSOkeMVAOnJze2U2fmBE2VGYIqDFmeMgVS7MUig';
const TARGET_GID = '1231979328';
const FORM_ORIGINAL_ID = '1jbbZ9xNVWdVs_n7eq1Bs19FZfjzt7hFaQo-GLlzjaas';

// Nombre de la carpeta en Google Drive donde se guardarán los comprobantes
const DRIVE_FOLDER_NAME = 'Comprobantes Formulario Web';

/**
 * Normaliza cadenas de texto para comparar títulos sin importar mayúsculas,
 * tildes, signos de puntuación ni espacios.
 */
function normalizeStr(str) {
  if (!str) return '';
  return str.toString()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

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

    // 2. Obtener o crear la carpeta en Google Drive para comprobantes
    let driveFolder = null;
    const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    if (folders.hasNext()) {
      driveFolder = folders.next();
    } else {
      driveFolder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    }

    // 3. Procesar archivos y construir mapa de respuestas (por título e ID normalizados)
    const respuestasMap = {};
    if (data.respuestas && Array.isArray(data.respuestas)) {
      data.respuestas.forEach(r => {
        let valorFinal = '';

        // Si es un archivo (comprobante / recibo)
        if (r.tipo === 'file' && r.archivo && r.archivo.base64) {
          try {
            const bytes = Utilities.base64Decode(r.archivo.base64);
            const nombreLimpio = (r.archivo.nombre || 'comprobante_' + new Date().getTime())
              .replace(/[^a-zA-Z0-9._-]/g, '_');
            const blob = Utilities.newBlob(bytes, r.archivo.tipoMime || 'image/jpeg', nombreLimpio);
            
            // Crear el archivo en Google Drive
            const nuevoArchivoDrive = driveFolder.createFile(blob);
            nuevoArchivoDrive.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            
            // Enlace de Google Drive para la hoja de cálculo
            valorFinal = nuevoArchivoDrive.getUrl();
          } catch (errArchivo) {
            valorFinal = 'Error al subir comprobante: ' + errArchivo.toString();
          }
        } else {
          valorFinal = r.valor;
          if (Array.isArray(valorFinal)) valorFinal = valorFinal.join(', ');
          if (valorFinal === undefined || valorFinal === null) valorFinal = '';
        }

        // Registrar en el mapa por título en español, en inglés, título original e ID
        if (r.titulo) respuestasMap[normalizeStr(r.titulo)] = valorFinal;
        if (r.tituloEs) respuestasMap[normalizeStr(r.tituloEs)] = valorFinal;
        if (r.tituloEn) respuestasMap[normalizeStr(r.tituloEn)] = valorFinal;
        if (r.id) respuestasMap[normalizeStr(r.id)] = valorFinal;
      });
    }

    // 4. Leer encabezados reales de la Fila 1 en la hoja de cálculo
    const lastCol = sheet.getLastColumn();
    let headers = [];
    if (lastCol > 0) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    // Si la hoja está totalmente vacía, crear encabezados automáticos
    if (headers.length === 0 || sheet.getLastRow() === 0) {
      headers = ['Marca temporal', 'Idioma'];
      if (data.respuestas && Array.isArray(data.respuestas)) {
        data.respuestas.forEach(r => headers.push(r.tituloEs || r.titulo || r.id));
      }
      sheet.appendRow(headers);
    }

    // 5. Construir la fila de datos asegurando coincidencia 1 a 1 con los encabezados
    const fila = new Array(headers.length).fill('');

    for (let c = 0; c < headers.length; c++) {
      const headerRaw = headers[c];
      const hNorm = normalizeStr(headerRaw);

      if (!hNorm) continue;

      // Columna de Marca temporal / Timestamp
      if (hNorm.indexOf('marcatemporal') !== -1 || hNorm.indexOf('timestamp') !== -1) {
        fila[c] = new Date();
        continue;
      }

      // Columna de Idioma (solo si existe explícitamente en la hoja)
      if (hNorm === 'idioma' || hNorm === 'language') {
        fila[c] = data.idioma || 'ES';
        continue;
      }

      // 1. Coincidencia directa exacta
      if (respuestasMap.hasOwnProperty(hNorm)) {
        fila[c] = respuestasMap[hNorm];
        continue;
      }

      // 2. Coincidencia parcial si el encabezado o la pregunta tienen ligeras variaciones
      let encontrado = false;
      for (const key in respuestasMap) {
        if (key.length > 5 && (hNorm.indexOf(key) !== -1 || key.indexOf(hNorm) !== -1)) {
          fila[c] = respuestasMap[key];
          encontrado = true;
          break;
        }
      }
    }

    // Respaldo de Marca temporal si no se identificó columna por nombre
    if (fila[0] === '' && headers[0] && normalizeStr(headers[0]).indexOf('marca') !== -1) {
      fila[0] = new Date();
    }

    // 6. Insertar los datos en la fila destino directamente en sus columnas
    const targetRow = sheet.getLastRow() + 1;
    sheet.getRange(targetRow, 1, 1, fila.length).setValues([fila]);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Datos y comprobante guardados exitosamente en sus columnas correspondientes',
      rowInserted: targetRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint GET: Monitoreo y diagnóstico de columnas
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = null;
    const sheets = ss.getSheets();
    for (let i = 0; i < sheets.length; i++) {
      if (String(sheets[i].getSheetId()) === TARGET_GID) {
        sheet = sheets[i];
        break;
      }
    }
    if (!sheet) sheet = ss.getSheets()[0];

    const lastCol = sheet.getLastColumn();
    const headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'online', 
      service: 'Google Sheets & Drive Webhook (Header-Mapped)',
      sheetName: sheet.getName(),
      totalColumns: lastCol,
      headers: headers
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'online', 
      service: 'Google Sheets & Drive Webhook',
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
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
