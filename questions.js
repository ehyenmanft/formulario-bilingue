/**
 * CONFIGURACIÓN Y PREGUNTAS DEL FORMULARIO
 */

const FORM_CONFIG = {
  webhookUrl: "https://script.google.com/macros/s/AKfycbzP8btx_Ud_ZP6i9ib3eXWXdCzHLdlyRA8aHaf1L_hUMikrmC36quASAQ2BZjLNyegG/exec", // URL de Webhook de respaldo (Google Sheets)
  supabaseUrl: window.__SUPABASE_URL__ || localStorage.getItem('amazona_supabase_url') || "",
  supabaseAnonKey: window.__SUPABASE_ANON_KEY__ || localStorage.getItem('amazona_supabase_key') || "",
  supabaseTable: "respuestas_formulario",

  titulo: {
    es: "Formulario de Registro y Comprobante",
    en: "Registration & Receipt Form"
  },
  descripcion: {
    es: "Por favor completa la siguiente información y anexa tu comprobante. Puedes alternar entre español e inglés en cualquier momento sin perder tus datos.",
    en: "Please fill out the following information and attach your receipt. You can switch between Spanish and English at any time without losing your data."
  },
  
  preguntas: [
    {
      id: "nombre",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "Nombre completo", en: "Full Name" },
      ayuda: { es: "Ingresa tu nombre y apellidos", en: "Enter your first and last name" },
      placeholder: { es: "Ej. Juan Pérez", en: "e.g. John Doe" }
    },
    {
      id: "email",
      tipo: "text",
      inputType: "email",
      colSpan: 6,
      requerido: true,
      titulo: { es: "Correo electrónico", en: "Email Address" },
      ayuda: { es: "Te enviaremos la confirmación aquí", en: "We will send confirmation here" },
      placeholder: { es: "nombre@ejemplo.com", en: "name@example.com" }
    },
    {
      id: "telefono",
      tipo: "text",
      inputType: "tel",
      colSpan: 6,
      requerido: false,
      titulo: { es: "Número de teléfono", en: "Phone Number" },
      ayuda: { es: "Opcional, incluye código de país", en: "Optional, include country code" },
      placeholder: { es: "+1 (555) 000-0000", en: "+1 (555) 000-0000" }
    },
    {
      id: "fecha",
      tipo: "text",
      inputType: "date",
      colSpan: 6,
      requerido: false,
      titulo: { es: "Fecha del comprobante / transacción", en: "Receipt / Transaction Date" },
      ayuda: { es: "Fecha indicada en tu comprobante", en: "Date shown on your receipt" }
    },
    {
      id: "tipo_pago",
      tipo: "pills-radio",
      colSpan: 12,
      requerido: true,
      titulo: { es: "Método de pago utilizado", en: "Payment Method Used" },
      ayuda: { es: "Selecciona el canal por el cual realizaste el pago", en: "Select the channel through which you paid" },
      opciones: {
        es: ["Transferencia Bancaria", "Tarjeta de Crédito / Débito", "Efectivo", "Otro"],
        en: ["Bank Transfer", "Credit / Debit Card", "Cash", "Other"]
      }
    },
    {
      id: "comprobante_archivo",
      tipo: "file",
      colSpan: 12,
      requerido: true,
      titulo: { es: "Carga de comprobante de pago", en: "Upload Payment Receipt" },
      ayuda: { 
        es: "Anexa una foto o captura de tu comprobante (formatos aceptados: JPG, PNG, WEBP o PDF, máx. 10MB)", 
        en: "Attach a photo or screenshot of your receipt (accepted formats: JPG, PNG, WEBP or PDF, max 10MB)" 
      }
    },
    {
      id: "satisfaccion",
      tipo: "scale",
      colSpan: 12,
      requerido: false,
      titulo: { es: "¿Cómo calificarías el proceso?", en: "How would you rate the process?" },
      ayuda: { es: "Siendo 1 la menor calificación y 5 la máxima", en: "Where 1 is lowest and 5 is highest" },
      scaleBounds: {
        min: 1,
        max: 5,
        leftLabel: { es: "Insatisfecho", en: "Unsatisfied" },
        rightLabel: { es: "Muy satisfecho", en: "Very satisfied" }
      }
    },
    {
      id: "comentarios",
      tipo: "textarea",
      colSpan: 12,
      requerido: false,
      titulo: { es: "Notas o comentarios adicionales", en: "Additional Notes or Comments" },
      ayuda: { es: "Escribe cualquier aclaración sobre tu comprobante si es necesario", en: "Write any clarification about your receipt if necessary" },
      placeholder: { es: "Escribe aquí...", en: "Write here..." }
    }
  ]
};
