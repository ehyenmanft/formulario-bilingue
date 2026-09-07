/**
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN WEB - AMAZONA FITNESS
 */

let currentLang = 'es';
let currentTheme = 'dark';
const uploadedFiles = {}; // Guarda { [questionId]: { nombre, tipoMime, base64, size } }

const I18N = {
  es: {
    brandStatus: "Amazona Fitness",
    requiredLegend: "Campos obligatorios",
    submitBtn: "Enviar respuesta",
    submittingBtn: "Enviando respuesta y comprobante...",
    successHeading: "¡Gracias por completar tu evaluación!",
    successBody: "Tus respuestas y comprobante han sido recibidos con éxito. Estaremos en contacto muy pronto para entregarte tu plan personalizado.",
    coachReachText: "Ponte en contacto directo o síguenos para comenzar:",
    btnNewResponse: "Enviar otra respuesta",
    selectDefault: "-- Selecciona una opción --",
    alertTitle: "Por favor completa los siguientes campos obligatorios:",
    dropzoneTitle: "Haz clic o arrastra tu comprobante aquí",
    dropzoneHint: "Formatos permitidos: JPG, PNG, WEBP o PDF (máx. 10MB)",
    fileSelected: "Comprobante cargado",
    footerText: "Amazona Fitness • Gil Reverand • Conexión directa con Google Sheets"
  },
  en: {
    brandStatus: "Amazona Fitness",
    requiredLegend: "Required fields",
    submitBtn: "Submit response",
    submittingBtn: "Submitting response & receipt...",
    successHeading: "Thank you for completing your evaluation!",
    successBody: "Your responses and receipt have been successfully received. We will be in touch shortly to deliver your personalized plan.",
    coachReachText: "Get in direct touch or follow us to get started:",
    btnNewResponse: "Submit another response",
    selectDefault: "-- Select an option --",
    alertTitle: "Please complete the following required fields:",
    dropzoneTitle: "Click or drag your receipt here",
    dropzoneHint: "Allowed formats: JPG, PNG, WEBP or PDF (max 10MB)",
    fileSelected: "Receipt loaded",
    footerText: "Amazona Fitness • Gil Reverand • Direct Google Sheets Connection"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initForm();
});

// ==========================================
// TEMA (DARK / LIGHT)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  if (theme === 'dark') {
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  } else {
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  }
}

// ==========================================
// IDIOMA (SWITCH ES / EN)
// ==========================================
function setLanguage(lang) {
  if (currentLang === lang) return;
  currentLang = lang;

  document.getElementById('btn-lang-es').classList.toggle('active', lang === 'es');
  document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');

  document.getElementById('brand-status').innerText = I18N[lang].brandStatus;
  document.getElementById('text-required-legend').innerText = I18N[lang].requiredLegend;
  document.getElementById('btn-text').innerText = I18N[lang].submitBtn;
  
  const successTitle = document.getElementById('success-title');
  if (successTitle) successTitle.innerText = I18N[lang].successHeading;
  
  const successMsg = document.getElementById('success-message');
  if (successMsg) successMsg.innerText = I18N[lang].successBody;

  const coachReach = document.getElementById('coach-reach-text');
  if (coachReach) coachReach.innerText = I18N[lang].coachReachText;

  const alertTitle = document.getElementById('alert-title');
  if (alertTitle) alertTitle.innerText = I18N[lang].alertTitle;

  document.getElementById('btn-new-response').innerText = I18N[lang].btnNewResponse;
  document.getElementById('footer-text').innerText = I18N[lang].footerText;

  document.getElementById('form-main-title').innerText = FORM_CONFIG.titulo[lang];
  document.getElementById('form-main-desc').innerText = FORM_CONFIG.descripcion[lang];

  updateQuestionTexts();
}

// ==========================================
// RENDERIZADO DEL FORMULARIO
// ==========================================
function initForm() {
  document.getElementById('form-main-title').innerText = FORM_CONFIG.titulo[currentLang];
  document.getElementById('form-main-desc').innerText = FORM_CONFIG.descripcion[currentLang];

  const grid = document.getElementById('questions-grid');
  grid.innerHTML = '';

  FORM_CONFIG.preguntas.forEach(q => {
    // Encabezados de Sección
    if (q.tipo === 'section') {
      const sectionBlock = document.createElement('div');
      sectionBlock.className = 'section-header-block col-12';
      sectionBlock.id = `block_${q.id}`;
      sectionBlock.innerHTML = `
        <div class="section-header-content">
          <div class="section-pill">
            <span class="pulse-dot"></span>
            <span class="section-label">SECCIÓN</span>
          </div>
          <h2 class="section-title title-text">${q.titulo[currentLang]}</h2>
          ${q.ayuda ? `<p class="section-help question-help">${q.ayuda[currentLang]}</p>` : ''}
        </div>
      `;
      grid.appendChild(sectionBlock);
      return;
    }

    const block = document.createElement('div');
    block.className = `question-block col-${q.colSpan || 12}`;
    block.id = `block_${q.id}`;

    let inputHtml = '';

    if (q.tipo === 'file') {
      inputHtml = `
        <div class="file-component-wrapper" id="wrapper_${q.id}">
          <div class="file-dropzone" id="dropzone_${q.id}" onclick="document.getElementById('file_input_${q.id}').click()">
            <input type="file" id="file_input_${q.id}" style="display:none;" accept="image/png, image/jpeg, image/webp, application/pdf" onchange="handleFileSelect(event, '${q.id}')" />
            <div class="dropzone-content">
              <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <div class="dropzone-title" id="drop_title_${q.id}">${I18N[currentLang].dropzoneTitle}</div>
              <div class="dropzone-hint" id="drop_hint_${q.id}">${I18N[currentLang].dropzoneHint}</div>
            </div>
          </div>
          <div class="file-preview" id="preview_${q.id}" style="display:none;">
            <img class="preview-thumb" id="thumb_${q.id}" src="" alt="Comprobante" />
            <div class="file-info">
              <div class="file-name" id="fname_${q.id}"></div>
              <div class="file-size" id="fsize_${q.id}"></div>
            </div>
            <button type="button" class="btn-remove-file" onclick="removeFile('${q.id}')" title="Eliminar archivo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <input type="hidden" id="input_${q.id}" name="${q.id}" />
        </div>
      `;
    }
    else if (q.tipo === 'text') {
      inputHtml = `<input type="${q.inputType || 'text'}" id="input_${q.id}" name="${q.id}" placeholder="${q.placeholder ? q.placeholder[currentLang] || '' : ''}" oninput="clearError('${q.id}')" />`;
    } 
    else if (q.tipo === 'textarea') {
      inputHtml = `<textarea id="input_${q.id}" name="${q.id}" placeholder="${q.placeholder ? q.placeholder[currentLang] || '' : ''}" oninput="clearError('${q.id}')"></textarea>`;
    } 
    else if (q.tipo === 'select') {
      inputHtml = `
        <select id="input_${q.id}" name="${q.id}" onchange="clearError('${q.id}')">
          <option value="">${I18N[currentLang].selectDefault}</option>
          ${q.opciones[currentLang].map((opt, i) => `<option value="${q.opciones['es'][i]}">${opt}</option>`).join('')}
        </select>
      `;
    } 
    else if (q.tipo === 'pills-radio') {
      inputHtml = `
        <div class="pills-grid">
          ${q.opciones[currentLang].map((opt, i) => `
            <label class="pill-card">
              <input type="radio" name="${q.id}" value="${q.opciones['es'][i]}" onchange="clearError('${q.id}')" />
              <span class="opt-label" data-index="${i}">${opt}</span>
            </label>
          `).join('')}
        </div>
      `;
    } 
    else if (q.tipo === 'pills-checkbox') {
      inputHtml = `
        <div class="pills-grid">
          ${q.opciones[currentLang].map((opt, i) => `
            <label class="pill-card">
              <input type="checkbox" name="${q.id}" value="${q.opciones['es'][i]}" onchange="clearError('${q.id}')" />
              <span class="opt-label" data-index="${i}">${opt}</span>
            </label>
          `).join('')}
        </div>
      `;
    } 
    else if (q.tipo === 'scale') {
      const bounds = q.scaleBounds;
      let buttons = '';
      for (let v = bounds.min; v <= bounds.max; v++) {
        buttons += `
          <label class="scale-button">
            <input type="radio" name="${q.id}" value="${v}" onchange="clearError('${q.id}')" />
            <span>${v}</span>
          </label>
        `;
      }
      inputHtml = `
        <div class="scale-group">
          <div class="scale-buttons">${buttons}</div>
          <div class="scale-labels">
            <span class="scale-label-left">${bounds.leftLabel[currentLang] || ''}</span>
            <span class="scale-label-right">${bounds.rightLabel[currentLang] || ''}</span>
          </div>
        </div>
      `;
    }

    block.innerHTML = `
      <div class="question-header">
        <label class="question-title" for="input_${q.id}">
          <span class="title-text">${q.titulo[currentLang]}</span>
          ${q.requerido ? '<span class="star">*</span>' : ''}
        </label>
        ${q.ayuda ? `<div class="question-help">${q.ayuda[currentLang]}</div>` : ''}
      </div>
      <div class="question-control">
        ${inputHtml}
      </div>
    `;

    grid.appendChild(block);

    if (q.tipo === 'file') {
      setupDropzone(q.id);
    }
  });
}

function updateQuestionTexts() {
  FORM_CONFIG.preguntas.forEach(q => {
    const block = document.getElementById(`block_${q.id}`);
    if (!block) return;

    const titleElem = block.querySelector('.title-text');
    if (titleElem) titleElem.innerText = q.titulo[currentLang];

    const help = block.querySelector('.question-help');
    if (help && q.ayuda) help.innerText = q.ayuda[currentLang];

    if (q.tipo === 'file') {
      const dropTitle = document.getElementById(`drop_title_${q.id}`);
      const dropHint = document.getElementById(`drop_hint_${q.id}`);
      if (dropTitle) dropTitle.innerText = I18N[currentLang].dropzoneTitle;
      if (dropHint) dropHint.innerText = I18N[currentLang].dropzoneHint;
    }
    else if (q.tipo === 'text' || q.tipo === 'textarea') {
      const input = block.querySelector('input, textarea');
      if (input && q.placeholder) input.placeholder = q.placeholder[currentLang] || '';
    } 
    else if (q.tipo === 'select') {
      const select = block.querySelector('select');
      if (select && select.options.length > 0) {
        select.options[0].text = I18N[currentLang].selectDefault;
        q.opciones[currentLang].forEach((opt, idx) => {
          if (select.options[idx + 1]) select.options[idx + 1].text = opt;
        });
      }
    } 
    else if (q.tipo === 'pills-radio' || q.tipo === 'pills-checkbox') {
      const labels = block.querySelectorAll('.opt-label');
      labels.forEach(label => {
        const idx = parseInt(label.getAttribute('data-index'), 10);
        if (q.opciones[currentLang][idx]) {
          label.innerText = q.opciones[currentLang][idx];
        }
      });
    } 
    else if (q.tipo === 'scale') {
      const left = block.querySelector('.scale-label-left');
      const right = block.querySelector('.scale-label-right');
      if (left) left.innerText = q.scaleBounds.leftLabel[currentLang] || '';
      if (right) right.innerText = q.scaleBounds.rightLabel[currentLang] || '';
    }
  });
}

// ==========================================
// VALIDACIÓN INTELIGENTE DE CAMPOS
// ==========================================
function clearError(questionId) {
  const block = document.getElementById(`block_${questionId}`);
  if (block) block.classList.remove('has-error');

  // Si ya no quedan errores, ocultar banner
  if (document.querySelectorAll('.question-block.has-error').length === 0) {
    const alertBox = document.getElementById('validation-alert');
    if (alertBox) alertBox.style.display = 'none';
  }
}

function validateForm() {
  const missing = [];

  FORM_CONFIG.preguntas.forEach(q => {
    if (q.tipo === 'section' || !q.requerido) return;

    let isFilled = false;

    if (q.tipo === 'file') {
      isFilled = !!uploadedFiles[q.id];
    } else if (q.tipo === 'pills-checkbox') {
      isFilled = document.querySelectorAll(`input[name="${q.id}"]:checked`).length > 0;
    } else if (q.tipo === 'pills-radio' || q.tipo === 'scale') {
      isFilled = document.querySelector(`input[name="${q.id}"]:checked`) !== null;
    } else {
      const elem = document.querySelector(`[name="${q.id}"]`);
      isFilled = elem && elem.value && elem.value.trim() !== '';
    }

    const block = document.getElementById(`block_${q.id}`);
    if (!isFilled) {
      missing.push({
        id: q.id,
        titulo: q.titulo[currentLang]
      });
      if (block) block.classList.add('has-error');
    } else {
      if (block) block.classList.remove('has-error');
    }
  });

  const alertBox = document.getElementById('validation-alert');
  const missingList = document.getElementById('missing-fields-list');

  if (missing.length > 0) {
    alertBox.style.display = 'flex';
    missingList.innerHTML = '';

    missing.forEach(m => {
      const li = document.createElement('li');
      li.innerText = m.titulo;
      li.title = currentLang === 'es' ? 'Haz clic para ir a esta pregunta' : 'Click to jump to this question';
      li.onclick = () => {
        const targetBlock = document.getElementById(`block_${m.id}`);
        if (targetBlock) {
          targetBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
      missingList.appendChild(li);
    });

    // Desplazar la vista suavemente a la primera pregunta faltante
    const firstMissingBlock = document.getElementById(`block_${missing[0].id}`);
    if (firstMissingBlock) {
      firstMissingBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return false;
  }

  alertBox.style.display = 'none';
  return true;
}

// ==========================================
// MANEJO DE ARCHIVOS (COMPROBANTES)
// ==========================================
function setupDropzone(questionId) {
  const dropzone = document.getElementById(`dropzone_${questionId}`);
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0], questionId);
    }
  });
}

function handleFileSelect(event, questionId) {
  const file = event.target.files[0];
  if (file) {
    processFile(file, questionId);
  }
}

function processFile(file, questionId) {
  if (file.size > 10 * 1024 * 1024) {
    alert(currentLang === 'es' 
      ? "El comprobante excede el tamaño máximo de 10MB" 
      : "The receipt exceeds the 10MB limit");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const base64Data = dataUrl.split(',')[1];

    uploadedFiles[questionId] = {
      nombre: file.name,
      tipoMime: file.type || 'image/jpeg',
      base64: base64Data,
      size: (file.size / 1024).toFixed(1) + ' KB'
    };

    clearError(questionId);

    const hiddenInput = document.getElementById(`input_${questionId}`);
    if (hiddenInput) hiddenInput.value = file.name;

    document.getElementById(`dropzone_${questionId}`).style.display = 'none';
    const preview = document.getElementById(`preview_${questionId}`);
    const thumb = document.getElementById(`thumb_${questionId}`);
    
    if (file.type.startsWith('image/')) {
      thumb.src = dataUrl;
      thumb.style.display = 'block';
    } else {
      thumb.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
    }

    document.getElementById(`fname_${questionId}`).innerText = file.name;
    document.getElementById(`fsize_${questionId}`).innerText = uploadedFiles[questionId].size;
    preview.style.display = 'flex';
  };

  reader.readAsDataURL(file);
}

function removeFile(questionId) {
  delete uploadedFiles[questionId];
  const fileInput = document.getElementById(`file_input_${questionId}`);
  if (fileInput) fileInput.value = '';

  const hiddenInput = document.getElementById(`input_${questionId}`);
  if (hiddenInput) hiddenInput.value = '';

  document.getElementById(`preview_${questionId}`).style.display = 'none';
  document.getElementById(`dropzone_${questionId}`).style.display = 'block';
}

// ==========================================
// ENVÍO DE DATOS A GOOGLE SHEETS & DRIVE
// ==========================================
async function handleFormSubmit(event) {
  event.preventDefault();

  // 1. Ejecutar validación inteligente
  if (!validateForm()) {
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');

  submitBtn.disabled = true;
  btnSpinner.style.display = 'inline-block';
  btnText.innerText = I18N[currentLang].submittingBtn;

  // 2. Recopilar respuestas
  const respuestas = [];
  FORM_CONFIG.preguntas.forEach(q => {
    if (q.tipo === 'section') return;

    if (q.tipo === 'file') {
      const archivoObj = uploadedFiles[q.id];
      respuestas.push({
        id: q.id,
        tipo: 'file',
        titulo: q.titulo['es'],
        archivo: archivoObj || null,
        valor: archivoObj ? archivoObj.nombre : ''
      });
    } else {
      let valor = '';
      if (q.tipo === 'pills-checkbox') {
        const checked = document.querySelectorAll(`input[name="${q.id}"]:checked`);
        valor = Array.from(checked).map(c => c.value);
      } else if (q.tipo === 'pills-radio' || q.tipo === 'scale') {
        const selected = document.querySelector(`input[name="${q.id}"]:checked`);
        valor = selected ? selected.value : '';
      } else {
        const elem = document.querySelector(`[name="${q.id}"]`);
        valor = elem ? elem.value : '';
      }

      respuestas.push({
        id: q.id,
        tipo: q.tipo,
        titulo: q.titulo['es'],
        valor: valor
      });
    }
  });

  const payload = {
    idioma: currentLang.toUpperCase(),
    respuestas: respuestas,
    fechaEnvio: new Date().toISOString()
  };

  try {
    // Envío con fetch a Google Apps Script Webhook
    await fetch(FORM_CONFIG.webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Éxito: Ocultar formulario y mostrar pantalla de agradecimiento con Gil Reverand
    document.getElementById('dynamic-form').style.display = 'none';
    document.getElementById('success-card').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error("Error al enviar formulario:", error);
    alert(currentLang === 'es' ? "Error al enviar: " + error.message : "Submission error: " + error.message);
  } finally {
    submitBtn.disabled = false;
    btnSpinner.style.display = 'none';
    btnText.innerText = I18N[currentLang].submitBtn;
  }
}

function resetForm() {
  document.getElementById('dynamic-form').reset();
  Object.keys(uploadedFiles).forEach(k => removeFile(k));
  document.querySelectorAll('.question-block.has-error').forEach(b => b.classList.remove('has-error'));
  document.getElementById('validation-alert').style.display = 'none';
  document.getElementById('dynamic-form').style.display = 'block';
  document.getElementById('success-card').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
