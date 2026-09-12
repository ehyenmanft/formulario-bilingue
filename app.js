/**
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN WEB - AMAZONA FITNESS
 * Formulario Multipaso (Tarjetas de Secciones)
 */

let currentLang = 'es';
let currentTheme = 'dark';
let currentStepIndex = 0;
let formSteps = []; // Lista de { id, titulo, ayuda, preguntas: [...] }
const uploadedFiles = {}; // { [questionId]: { nombre, tipoMime, base64, size } }

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
    btnPrev: "Anterior",
    btnNext: "Siguiente sección",
    stepPrefix: "Sección",
    of: "de",
    firstSectionTitle: "Datos Básicos y Biometría",
    firstSectionDesc: "Por favor proporciona tus datos de contacto y medidas para comenzar.",
    selectDefault: "-- Selecciona una opción --",
    alertTitle: "Por favor completa los siguientes campos obligatorios de esta sección:",
    dropzoneTitle: "Haz clic o arrastra tu comprobante aquí",
    dropzoneHint: "Formatos permitidos: JPG, PNG, WEBP o PDF (máx. 10MB)",
    fileSelected: "Comprobante cargado",
    removeFileTitle: "Eliminar comprobante",
    receiptAttached: "Comprobante adjuntado con éxito",
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
    btnPrev: "Back",
    btnNext: "Next section",
    stepPrefix: "Section",
    of: "of",
    firstSectionTitle: "Basic Information & Biometrics",
    firstSectionDesc: "Please provide your contact information and measurements to get started.",
    selectDefault: "-- Select an option --",
    alertTitle: "Please complete the following required fields in this section:",
    dropzoneTitle: "Click or drag your receipt here",
    dropzoneHint: "Allowed formats: JPG, PNG, WEBP or PDF (max 10MB)",
    fileSelected: "Receipt loaded",
    removeFileTitle: "Remove receipt",
    receiptAttached: "Receipt attached successfully",
    footerText: "Amazona Fitness • Gil Reverand • Direct Google Sheets Connection"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  buildStepsStructure();
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
  document.getElementById('btn-prev-text').innerText = I18N[lang].btnPrev;
  document.getElementById('btn-next-text').innerText = I18N[lang].btnNext;
  
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

  updateProgressIndicator();
  updateQuestionTexts();
}

// ==========================================
// AGRUPAR PREGUNTAS EN SECCIONES (PÁGINAS)
// ==========================================
function buildStepsStructure() {
  formSteps = [];
  let currentStep = {
    index: 0,
    titulo: { es: I18N.es.firstSectionTitle, en: I18N.en.firstSectionTitle },
    ayuda: { es: I18N.es.firstSectionDesc, en: I18N.en.firstSectionDesc },
    preguntas: []
  };

  FORM_CONFIG.preguntas.forEach(q => {
    if (q.tipo === 'section') {
      if (currentStep.preguntas.length > 0) {
        formSteps.push(currentStep);
      }
      currentStep = {
        index: formSteps.length,
        titulo: q.titulo,
        ayuda: q.ayuda || { es: '', en: '' },
        preguntas: []
      };
    } else {
      currentStep.preguntas.push(q);
    }
  });

  if (currentStep.preguntas.length > 0) {
    formSteps.push(currentStep);
  }
}

// ==========================================
// RENDERIZADO DEL FORMULARIO EN TARJETAS DE PÁGINAS
// ==========================================
function initForm() {
  document.getElementById('form-main-title').innerText = FORM_CONFIG.titulo[currentLang];
  document.getElementById('form-main-desc').innerText = FORM_CONFIG.descripcion[currentLang];

  const stepsContainer = document.getElementById('steps-container');
  stepsContainer.innerHTML = '';

  formSteps.forEach((step, sIdx) => {
    const page = document.createElement('div');
    page.className = 'form-step-page';
    page.id = `step_page_${sIdx}`;
    page.style.display = (sIdx === currentStepIndex) ? 'block' : 'none';

    // Encabezado de la tarjeta de sección
    const headerHtml = `
      <div class="section-header-block" id="header_step_${sIdx}">
        <div class="section-header-content">
          <div class="section-pill">
            <span class="pulse-dot"></span>
            <span class="step-badge-text">${I18N[currentLang].stepPrefix} ${sIdx + 1} ${I18N[currentLang].of} ${formSteps.length}</span>
          </div>
          <h2 class="section-title step-title-text">${step.titulo[currentLang]}</h2>
          ${step.ayuda && step.ayuda[currentLang] ? `<p class="section-help step-help-text">${step.ayuda[currentLang]}</p>` : ''}
        </div>
      </div>
    `;

    // Contenedor grid de las preguntas de este paso
    const grid = document.createElement('div');
    grid.className = 'form-grid';
    grid.style.marginTop = '20px';

    step.preguntas.forEach(q => {
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
              <img class="preview-thumb" id="thumb_${q.id}" src="" alt="${I18N[currentLang].fileSelected}" />
              <div class="file-info">
                <div class="file-name" id="fname_${q.id}"></div>
                <div class="file-size" id="fsize_${q.id}"></div>
              </div>
              <button type="button" class="btn-remove-file" onclick="removeFile('${q.id}')" title="${I18N[currentLang].removeFileTitle}">
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

    page.innerHTML = headerHtml;
    page.appendChild(grid);
    stepsContainer.appendChild(page);
  });

  updateProgressIndicator();
  updateNavigationButtons();
}

// ==========================================
// CONTROL DE PASOS (WIZARD NAVIGATION)
// ==========================================
function updateProgressIndicator() {
  if (formSteps.length === 0) return;
  const currentStep = formSteps[currentStepIndex];
  const stepNumber = currentStepIndex + 1;
  const total = formSteps.length;
  const pct = Math.round((stepNumber / total) * 100);

  document.getElementById('wizard-step-label').innerText = `${I18N[currentLang].stepPrefix} ${stepNumber} ${I18N[currentLang].of} ${total}`;
  document.getElementById('wizard-step-title').innerText = currentStep.titulo[currentLang];
  document.getElementById('wizard-step-percentage').innerText = `${pct}%`;
  document.getElementById('wizard-progress-fill').style.width = `${pct}%`;
}

function updateNavigationButtons() {
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const btnSubmit = document.getElementById('submit-btn');

  // Botón Anterior
  if (currentStepIndex === 0) {
    btnPrev.style.display = 'none';
  } else {
    btnPrev.style.display = 'inline-flex';
    document.getElementById('btn-prev-text').innerText = I18N[currentLang].btnPrev;
  }

  // Botón Siguiente vs Enviar
  if (currentStepIndex === formSteps.length - 1) {
    btnNext.style.display = 'none';
    btnSubmit.style.display = 'inline-flex';
    document.getElementById('btn-text').innerText = I18N[currentLang].submitBtn;
  } else {
    btnNext.style.display = 'inline-flex';
    btnSubmit.style.display = 'none';
    document.getElementById('btn-next-text').innerText = I18N[currentLang].btnNext;
  }
}

function nextStep() {
  // Validar solo los campos obligatorios del paso actual
  if (!validateStep(currentStepIndex)) {
    return;
  }

  // Ocultar alerta de validación
  document.getElementById('validation-alert').style.display = 'none';

  if (currentStepIndex < formSteps.length - 1) {
    document.getElementById(`step_page_${currentStepIndex}`).style.display = 'none';
    currentStepIndex++;
    const nextPage = document.getElementById(`step_page_${currentStepIndex}`);
    nextPage.style.display = 'block';

    updateProgressIndicator();
    updateNavigationButtons();
    scrollToTop();
  }
}

function prevStep() {
  document.getElementById('validation-alert').style.display = 'none';

  if (currentStepIndex > 0) {
    document.getElementById(`step_page_${currentStepIndex}`).style.display = 'none';
    currentStepIndex--;
    const prevPage = document.getElementById(`step_page_${currentStepIndex}`);
    prevPage.style.display = 'block';

    updateProgressIndicator();
    updateNavigationButtons();
    scrollToTop();
  }
}

function scrollToTop() {
  const headerCard = document.querySelector('.header-card');
  if (headerCard) {
    headerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ==========================================
// VALIDACIÓN INTELIGENTE POR SECCIÓN
// ==========================================
function clearError(questionId) {
  const block = document.getElementById(`block_${questionId}`);
  if (block) block.classList.remove('has-error');

  const stepPage = document.getElementById(`step_page_${currentStepIndex}`);
  if (stepPage && stepPage.querySelectorAll('.question-block.has-error').length === 0) {
    const alertBox = document.getElementById('validation-alert');
    if (alertBox) alertBox.style.display = 'none';
  }
}

function validateStep(stepIdx) {
  const step = formSteps[stepIdx];
  if (!step) return true;

  const missing = [];

  step.preguntas.forEach(q => {
    if (!q.requerido) return;

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
// ACTUALIZACIÓN DE TEXTOS EN CAMBIO DE IDIOMA
// ==========================================
function updateQuestionTexts() {
  formSteps.forEach((step, sIdx) => {
    const stepHeader = document.getElementById(`header_step_${sIdx}`);
    if (stepHeader) {
      const badge = stepHeader.querySelector('.step-badge-text');
      if (badge) badge.innerText = `${I18N[currentLang].stepPrefix} ${sIdx + 1} ${I18N[currentLang].of} ${formSteps.length}`;

      const title = stepHeader.querySelector('.step-title-text');
      if (title) title.innerText = step.titulo[currentLang];

      const help = stepHeader.querySelector('.step-help-text');
      if (help && step.ayuda) help.innerText = step.ayuda[currentLang] || '';
    }

    step.preguntas.forEach(q => {
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
        const removeBtn = block.querySelector('.btn-remove-file');
        if (removeBtn) removeBtn.title = I18N[currentLang].removeFileTitle;
        const thumb = document.getElementById(`thumb_${q.id}`);
        if (thumb) thumb.alt = I18N[currentLang].fileSelected;
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
  });
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
// ENVÍO FINAL A GOOGLE SHEETS & DRIVE
// ==========================================
async function handleFormSubmit(event) {
  event.preventDefault();

  // Validar última sección antes de enviar
  if (!validateStep(currentStepIndex)) {
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');

  submitBtn.disabled = true;
  btnSpinner.style.display = 'inline-block';
  btnText.innerText = I18N[currentLang].submittingBtn;

  const respuestas = [];
  FORM_CONFIG.preguntas.forEach(q => {
    if (q.tipo === 'section') return;

    if (q.tipo === 'file') {
      const archivoObj = uploadedFiles[q.id];
      respuestas.push({
        id: q.id,
        tipo: 'file',
        titulo: q.titulo['es'],
        tituloEs: q.titulo['es'],
        tituloEn: q.titulo['en'],
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
        tituloEs: q.titulo['es'],
        tituloEn: q.titulo['en'],
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
    // 1. Enviar a Supabase si está configurado
    if (FORM_CONFIG.supabaseUrl && FORM_CONFIG.supabaseAnonKey) {
      try {
        let receiptUrl = '';
        // Si hay archivo comprobante y bucket de storage disponible
        const fileEntry = respuestas.find(r => r.tipo === 'file' && r.archivo);
        if (fileEntry && fileEntry.archivo) {
          try {
            const fileName = `${Date.now()}_${fileEntry.archivo.nombre.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const fileBlob = await (await fetch(`data:${fileEntry.archivo.tipoMime};base64,${fileEntry.archivo.base64}`)).blob();
            const storageRes = await fetch(`${FORM_CONFIG.supabaseUrl}/storage/v1/object/comprobantes/${fileName}`, {
              method: 'POST',
              headers: {
                'apikey': FORM_CONFIG.supabaseAnonKey,
                'Authorization': `Bearer ${FORM_CONFIG.supabaseAnonKey}`,
                'Content-Type': fileEntry.archivo.tipoMime
              },
              body: fileBlob
            });
            if (storageRes.ok) {
              receiptUrl = `${FORM_CONFIG.supabaseUrl}/storage/v1/object/public/comprobantes/${fileName}`;
            }
          } catch (storageErr) {
            console.warn("Storage upload fallback:", storageErr);
          }
        }

        // Helper para obtener valor de respuesta
        const getVal = (id) => {
          const item = respuestas.find(r => r.id === id);
          if (!item) return null;
          return Array.isArray(item.valor) ? item.valor.join(', ') : item.valor;
        };

        // Construir fila estructurada para la tabla respuestas_formulario
        const rowData = {
          idioma: currentLang.toUpperCase(),
          nombre_completo: getVal('q_0') || getVal('nombre') || 'Atleta Sin Nombre',
          edad: getVal('q_1') ? parseInt(getVal('q_1'), 10) || null : null,
          genero: getVal('q_2') || '',
          email: getVal('q_3') || getVal('email') || '',
          email_direccion: getVal('q_3') || getVal('email') || '',
          telefono: getVal('q_4') || getVal('telefono') || '',
          pais_ciudad: getVal('q_5') || '',
          estatura_m: getVal('q_6') ? parseFloat(getVal('q_6')) || null : null,
          peso_actual_kg: getVal('q_7') ? parseFloat(getVal('q_7')) || null : null,
          peso_ideal_kg: getVal('q_8') ? parseFloat(getVal('q_8')) || null : null,
          objetivo_principal: getVal('q_10') || '',
          importancia_objetivo: getVal('q_11') ? parseInt(getVal('q_11'), 10) || null : null,
          motivacion: getVal('q_12') || '',
          fecha_limite: getVal('q_13') || '',
          objetivos_especificos: getVal('q_14') || '',
          disciplina_deportiva: getVal('q_16') || '',
          nivel_experiencia: getVal('q_17') || '',
          dias_entrenamiento: getVal('q_18') || '',
          experiencia_pesas: getVal('q_19') || '',
          deporte_regular: getVal('q_20') || '',
          lugar_entrenamiento: getVal('q_21') || '',
          equipo_casa: getVal('q_22') || '',
          tiempo_ejercicio: getVal('q_23') || '',
          tipo_ejercicio_actual: getVal('q_25') || '',
          horas_sueno: getVal('q_26') || '',
          nivel_estres: getVal('q_27') || '',
          consumo_agua_litros: getVal('q_28') || '',
          consumo_cafe: getVal('q_29') || '',
          dieta_actual: getVal('q_31') || '',
          alergias_alimenticias: getVal('q_32') || '',
          alimentos_evitar: getVal('q_33') || '',
          alimentos_preferidos: getVal('q_34') || '',
          horarios_comidas: getVal('q_35') || '',
          reduccion_macros_comodo: getVal('q_36') || '',
          condicion_medica: getVal('q_38') || '',
          medicamentos: getVal('q_39') || '',
          tratamiento_medico: getVal('q_40') || '',
          problemas_previos: getVal('q_41') || '',
          lesion_condicion: getVal('q_42') || '',
          suplementos_actuales: getVal('q_44') || '',
          interes_suplementacion: getVal('q_45') || '',
          alergia_suplementos: getVal('q_46') || '',
          consentimiento_testimonios: getVal('q_48') || '',
          metodo_pago: getVal('q_50') || getVal('tipo_pago') || '',
          comprobante_url: receiptUrl || (fileEntry ? fileEntry.archivo?.nombre : ''),
          raw_data: payload
        };

        await fetch(`${FORM_CONFIG.supabaseUrl}/rest/v1/${FORM_CONFIG.supabaseTable}`, {
          method: 'POST',
          headers: {
            'apikey': FORM_CONFIG.supabaseAnonKey,
            'Authorization': `Bearer ${FORM_CONFIG.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(rowData)
        });
        console.log("Respuesta guardada en Supabase 'Amazona Fitness' con éxito.");
      } catch (sbError) {
        console.warn("Error enviando a Supabase (continuando con Webhook):", sbError);
      }
    }

    // 2. Enviar a Google Apps Script Webhook (hoja de cálculo de respaldo)
    if (FORM_CONFIG.webhookUrl) {
      await fetch(FORM_CONFIG.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

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

  // Regresar al primer paso
  document.querySelectorAll('.form-step-page').forEach((p, idx) => {
    p.style.display = (idx === 0) ? 'block' : 'none';
  });
  currentStepIndex = 0;
  updateProgressIndicator();
  updateNavigationButtons();

  document.getElementById('dynamic-form').style.display = 'block';
  document.getElementById('success-card').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
