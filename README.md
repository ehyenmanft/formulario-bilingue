# Formulario Web Bilingüe con Carga de Comprobante e Integración a Google Drive y Sheets

Aplicación web moderna, lista para GitHub Pages, que permite alternar entre **Español** e **Inglés**, cambiar entre **Modo Oscuro** y **Modo Claro**, y **anexar imágenes o archivos de comprobantes** que se suben automáticamente a tu **Google Drive** y se vinculan a tu **Google Sheet**, tal como lo hace Google Forms.

---

## 📸 Cómo Funciona la Carga de Comprobantes
1. El usuario selecciona o arrastra su imagen o comprobante (JPG, PNG, WEBP o PDF).
2. La web muestra una **vista previa en miniatura** con el nombre y peso del archivo.
3. Al enviar, la imagen se transfiere codificada a tu Webhook de Google Apps Script.
4. El script en Apps Script:
   - Crea el archivo dentro de una carpeta en tu Google Drive llamada **"Comprobantes Formulario Web"**.
   - Configura el archivo para que cualquier persona con el enlace pueda visualizarlo.
   - Inserta el **enlace directo de Google Drive** (`https://drive.google.com/file/d/.../view`) en la celda de tu hoja de cálculo, exactamente igual a Google Forms.

---

## 🚀 Guía de Puesta en Marcha (Paso a Paso)

### Paso 1: Configurar el Webhook en tu Google Sheets
1. Abre tu hoja: [Google Sheets](https://docs.google.com/spreadsheets/d/11OU8BSOkeMVAOnJze2U2fmBE2VGYIqDFmeMgVS7MUig/edit).
2. Ve al menú superior **Extensiones** > **Apps Script**.
3. Copia todo el contenido del archivo `google-apps-script-webhook.js`.
4. Reemplaza el código en el editor de Apps Script y haz clic en **Guardar** 💾.
5. En la esquina superior derecha, haz clic en **Implementar** > **Nueva implementación**:
   - Tipo: **Aplicación web** (ícono de engranaje ⚙️).
   - **Descripción**: `Webhook con Carga de Archivos a Drive`.
   - **Ejecutar como**: `Yo (tu cuenta)`.
   - **Quién tiene acceso**: `Cualquier persona` (*Anyone*).
6. Haz clic en **Implementar** y autoriza los permisos de Google (incluye permisos de Sheets y Drive).
7. **Copia la URL de la aplicación web** generada (termina en `/exec`).

---

### Paso 2: Vincular la URL en tu proyecto web
1. Abre el archivo `questions.js` en tu proyecto.
2. Reemplaza la primera línea:
   ```javascript
   webhookUrl: "TU_URL_DE_WEBHOOK_AQUI",
   ```
   por tu URL de Apps Script copiada:
   ```javascript
   webhookUrl: "https://script.google.com/macros/s/AKfycb.../exec",
   ```

---

### Paso 3: Publicar en GitHub Pages
1. Crea un repositorio en [GitHub.com](https://github.com) (ejemplo: `formulario-comprobante`).
2. Sube los archivos de la carpeta:
   - `index.html`
   - `style.css`
   - `app.js`
   - `questions.js`
3. En el repositorio de GitHub, entra a **Settings** > **Pages** > Branch `main` / `root` y dale a **Save**.
4. ¡Listo! En un minuto tendrás tu enlace público funcionando.

---

## ✨ Características Principales
- **Carga de Archivos a Drive**: Zona drag-and-drop con previsualización de imágenes y subida a Google Drive.
- **Switch Bilingüe Real**: Alterna entre ES y EN en tiempo real sin borrar las respuestas escritas ni el archivo seleccionado.
- **Modo Oscuro / Claro**: Paleta moderna con almacenamiento en `localStorage` y detección de preferencia de sistema.
- **Grid Adaptativo 12 Columnas**: Nombres, correos, teléfonos y fechas alineados en pares para una vista limpia.
