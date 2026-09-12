/**
 * CONFIGURACIÓN Y PREGUNTAS DEL FORMULARIO DE COACHING / ASESORÍA
 * 
 * Contiene todas las 52 preguntas y secciones del formulario oficial
 * adaptadas para visualización bilingüe (ES / EN) y grid responsive.
 */

const FORM_CONFIG = {
  webhookUrl: "https://script.google.com/macros/s/AKfycbzP8btx_Ud_ZP6i9ib3eXWXdCzHLdlyRA8aHaf1L_hUMikrmC36quASAQ2BZjLNyegG/exec", // URL de Webhook de respaldo (Google Sheets)
  supabaseUrl: window.__SUPABASE_URL__ || localStorage.getItem('amazona_supabase_url') || "",
  supabaseAnonKey: window.__SUPABASE_ANON_KEY__ || localStorage.getItem('amazona_supabase_key') || "",
  supabaseTable: "respuestas_formulario",

  titulo: {
    es: "Formulario de Registro y Evaluación Integral",
    en: "Registration & Comprehensive Evaluation Form"
  },
  descripcion: {
    es: "Por favor completa el siguiente formulario detallado para diseñar tu plan personalizado de entrenamiento y nutrición. Puedes alternar entre español e inglés en cualquier momento con el botón superior sin perder tus respuestas.",
    en: "Please complete this detailed form to design your customized training and nutrition plan. You can toggle between Spanish and English at any time without losing your responses."
  },

  preguntas: [
    // SECCIÓN 1: DATOS BÁSICOS Y BIOMETRÍA
    {
      id: "q_0",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "Nombre Completo", en: "Full Name" },
      placeholder: { es: "Tu nombre y apellido", en: "Your first and last name" }
    },
    {
      id: "q_1",
      tipo: "text",
      inputType: "number",
      colSpan: 6,
      requerido: true,
      titulo: { es: "Edad", en: "Age" },
      placeholder: { es: "Ej. 28", en: "e.g. 28" }
    },
    {
      id: "q_2",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: true,
      titulo: { es: "Género", en: "Gender" },
      opciones: {
        es: ["Hombre", "Mujer"],
        en: ["Male", "Female"]
      }
    },
    {
      id: "q_3",
      tipo: "text",
      inputType: "email",
      colSpan: 6,
      requerido: true,
      titulo: { es: "Correo electrónico", en: "Email" },
      placeholder: { es: "correo@ejemplo.com", en: "email@example.com" }
    },
    {
      id: "q_4",
      tipo: "text",
      inputType: "tel",
      colSpan: 6,
      requerido: true,
      titulo: { es: "Número de Teléfono (WhatsApp / Mensajería)", en: "Contact Phone Number (WhatsApp / Messaging)" },
      placeholder: { es: "+1 (555) 000-0000", en: "+1 (555) 000-0000" }
    },
    {
      id: "q_5",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { 
        es: "País y Ciudad de Residencia", 
        en: "Country and City of Residence" 
      },
      ayuda: { 
        es: "Para tener en cuenta zonas horarias y opciones de alimentos locales", 
        en: "To consider time zones and local food options" 
      },
      placeholder: { es: "Ej. Madrid, España / Bogotá, Colombia", en: "e.g. New York, USA / London, UK" }
    },
    {
      id: "q_6",
      tipo: "text",
      inputType: "text",
      colSpan: 4,
      requerido: true,
      titulo: { es: "Estatura (en metros)", en: "Height (in meters)" },
      placeholder: { es: "Ej. 1.75", en: "e.g. 1.75" }
    },
    {
      id: "q_7",
      tipo: "text",
      inputType: "text",
      colSpan: 4,
      requerido: true,
      titulo: { es: "Peso Actual (en kg)", en: "Current Weight (in kg)" },
      placeholder: { es: "Ej. 74.5", en: "e.g. 74.5" }
    },
    {
      id: "q_8",
      tipo: "text",
      inputType: "text",
      colSpan: 4,
      requerido: true,
      titulo: { es: "Peso ideal o meta (en kg)", en: "Ideal or Target Weight (in kg)" },
      placeholder: { es: "Ej. 68.0", en: "e.g. 68.0" }
    },

    // SECCIÓN 2: OBJETIVOS Y MOTIVACIONES
    {
      id: "q_9",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Objetivos y Motivaciones", en: "Goals and Motivations" },
      ayuda: {
        es: "Dinos qué te mueve y hacia dónde quieres llegar. Conocer tus metas nos ayudará a diseñar un plan que esté alineado con tus aspiraciones.",
        en: "Tell us what motivates you and where you want to go. Understanding your goals will help us design a plan aligned with your aspirations."
      }
    },
    {
      id: "q_10",
      tipo: "pills-radio",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Cuál es tu objetivo principal?", en: "What is your main goal?" },
      opciones: {
        es: ["Perder grasa", "Ganar masa muscular", "Tonificar", "Mejorar resistencia", "Salud y bienestar", "Otros"],
        en: ["Lose fat", "Gain muscle mass", "Tone", "Improve endurance", "Health & wellness", "Other"]
      }
    },
    {
      id: "q_11",
      tipo: "scale",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Qué tan importante es este objetivo para ti? (1 a 10)", en: "How important is this goal to you? (1 to 10)" },
      scaleBounds: {
        min: 1,
        max: 10,
        leftLabel: { es: "Poco importante (1)", en: "Low priority (1)" },
        rightLabel: { es: "Máxima prioridad (10)", en: "Top priority (10)" }
      }
    },
    {
      id: "q_12",
      tipo: "textarea",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Qué te motiva a alcanzar este objetivo? (Salud, apariencia, bienestar mental, etc.)", en: "What motivates you to achieve this goal? (Health, appearance, mental well-being, etc.)" },
      placeholder: { es: "Explícanos tu motivación...", en: "Tell us your motivation..." }
    },
    {
      id: "q_13",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Tienes una fecha límite o meta de tiempo? (Especificar meses)", en: "Do you have a deadline or target time frame? (Specify months)" },
      placeholder: { es: "Ej. 3 meses / 6 meses", en: "e.g. 3 months / 6 months" }
    },
    {
      id: "q_14",
      tipo: "textarea",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Tienes objetivos específicos adicionales? (Ej.: reducir cintura, aumentar fuerza)", en: "Any additional specific goals? (e.g., reduce waist, increase strength)" },
      placeholder: { es: "Ej. Definir abdomen, mejorar sentadilla...", en: "e.g. Core definition, squat strength..." }
    },

    // SECCIÓN 3: ACTIVIDAD Y EXPERIENCIA
    {
      id: "q_15",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Nivel de Actividad y Experiencia", en: "Activity and Experience Level" },
      ayuda: {
        es: "Descubre cómo tu nivel actual de actividad y experiencia influirá en tu plan. Desde principiante hasta avanzado, nos adaptamos a ti.",
        en: "Discover how your current activity level and experience will shape your plan. From beginner to advanced, we adapt to you."
      }
    },
    {
      id: "q_16",
      tipo: "select",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Practicas alguna disciplina deportiva? (Si no está en la lista, selecciona \"Otros\")", en: "Do you practice any sport? (If not listed, select \"Other\")" },
      opciones: {
        es: [
          "Fútbol", "Baloncesto", "Béisbol", "Voleibol", "Atletismo", "Natación", "Ciclismo", "Tenis", "Pádel", 
          "Boxeo", "Artes marciales mixtas", "Karate", "Taekwondo", "Judo", "Lucha olímpica", "Gimnasia", 
          "CrossFit", "Levantamiento de pesas", "Powerlifting", "Calistenia", "Running", "Trail running", 
          "Triatlón", "Rugby", "Handball", "Hockey", "Patinaje", "Remo", "Escalada deportiva", "Surf", 
          "Skateboarding", "Danza deportiva", "Pole sport", "Kickboxing", "Muay Thai", "Esgrima", "Golf", 
          "Softbol", "Fútbol sala", "Entrenamiento funcional", "Otros / Otras"
        ],
        en: [
          "Soccer", "Basketball", "Baseball", "Volleyball", "Athletics", "Swimming", "Cycling", "Tennis", "Padel", 
          "Boxing", "Mixed Martial Arts", "Karate", "Taekwondo", "Judo", "Olympic Wrestling", "Gymnastics", 
          "CrossFit", "Weightlifting", "Powerlifting", "Calisthenics", "Running", "Trail Running", 
          "Triathlon", "Rugby", "Handball", "Hockey", "Skating", "Rowing", "Sport Climbing", "Surfing", 
          "Skateboarding", "Sport Dance", "Pole Sport", "Kickboxing", "Muay Thai", "Fencing", "Golf", 
          "Softball", "Futsal", "Functional Training", "Other"
        ]
      }
    },
    {
      id: "q_17",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Cuál es tu nivel de experiencia en entrenamiento?", en: "What is your training experience level?" },
      opciones: {
        es: ["Principiante", "Intermedio", "Avanzado"],
        en: ["Beginner", "Intermediate", "Advanced"]
      }
    },
    {
      id: "q_18",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: false,
      titulo: { es: "¿Cuántos días a la semana estás dispuesto a entrenar?", en: "How many days per week are you willing to train?" },
      opciones: {
        es: ["1 día", "2 días", "3 días", "4 días", "5 días"],
        en: ["1 day", "2 days", "3 days", "4 days", "5 days"]
      }
    },
    {
      id: "q_19",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: false,
      titulo: { es: "¿Tienes experiencia previa con pesas o máquinas de gimnasio?", en: "Previous experience with weights or gym machines?" },
      opciones: {
        es: ["Sí", "No"],
        en: ["Yes", "No"]
      }
    },
    {
      id: "q_20",
      tipo: "textarea",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Realizas o realizabas algún deporte regularmente? (Especificar)", en: "Do you or did you regularly practice any sport? (Specify)" },
      placeholder: { es: "Describe deporte y frecuencia...", en: "Describe sport and frequency..." }
    },
    {
      id: "q_21",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Tienes acceso a un gimnasio o prefieres entrenar en casa?", en: "Access to a gym or prefer home workouts?" },
      opciones: {
        es: ["Gimnasio", "En Casa", "Ambos"],
        en: ["Gym", "At Home", "Both"]
      }
    },
    {
      id: "q_22",
      tipo: "textarea",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Qué equipo tienes disponible en casa? (Pesas, bandas, etc.)", en: "What equipment do you have at home? (Weights, bands, etc.)" },
      placeholder: { es: "Mancuernas, colchoneta, barras...", en: "Dumbbells, mat, pull-up bar..." }
    },
    {
      id: "q_23",
      tipo: "text",
      inputType: "text",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Cuántas horas o minutos al día puedes dedicar al ejercicio?", en: "How many hours or minutes per day can you dedicate to exercise?" },
      placeholder: { es: "Ej. 45 minutos / 1 hora al día", en: "e.g. 45 minutes / 1 hour per day" }
    },

    // SECCIÓN 4: HÁBITOS ACTUALES
    {
      id: "q_24",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Hábitos Actuales", en: "Current Habits" },
      ayuda: {
        es: "Tus hábitos diarios son clave. Conocerlos nos permitirá identificar oportunidades para optimizar tu progreso de manera eficiente.",
        en: "Your daily habits are key. Knowing them will help us identify opportunities to optimize your progress efficiently."
      }
    },
    {
      id: "q_25",
      tipo: "textarea",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Qué tipo de ejercicio haces actualmente? (Cardio, pesas, yoga, etc.)", en: "What type of exercise do you currently do? (Cardio, weights, yoga, etc.)" },
      placeholder: { es: "Describe tu rutina actual...", en: "Describe your current routine..." }
    },
    {
      id: "q_26",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Cuántas horas duermes por noche en promedio?", en: "Average hours of sleep per night?" },
      placeholder: { es: "Ej. 7 horas", en: "e.g. 7 hours" }
    },
    {
      id: "q_27",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: false,
      titulo: { es: "¿Cómo calificarías tu nivel de estrés?", en: "How would you rate your stress level?" },
      opciones: {
        es: ["Bajo", "Medio", "Alto"],
        en: ["Low", "Medium", "High"]
      }
    },
    {
      id: "q_28",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Cuánta agua consumes al día (en litros)?", en: "How much water do you drink per day (in liters)?" },
      placeholder: { es: "Ej. 2 litros", en: "e.g. 2 liters" }
    },
    {
      id: "q_29",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Consumes café o bebidas energéticas? (Especificar cantidad diaria)", en: "Do you consume coffee or energy drinks? (Specify daily amount)" },
      placeholder: { es: "Ej. 2 tazas de café al día / Ninguna", en: "e.g. 2 cups of coffee per day / None" }
    },

    // SECCIÓN 5: ALIMENTACIÓN
    {
      id: "q_30",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Alimentación", en: "Nutrition" },
      ayuda: {
        es: "Lo que comes importa. Ayúdanos a entender tus preferencias, restricciones y estilo de vida para crear un plan nutricional sostenible.",
        en: "What you eat matters. Help us understand your preferences, restrictions, and lifestyle to create a sustainable nutrition plan."
      }
    },
    {
      id: "q_31",
      tipo: "textarea",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Sigues algún tipo de dieta actualmente? (Keto, vegetariana, omnívora, etc.)", en: "Currently following any specific diet? (Keto, vegetarian, omnivorous, etc.)" },
      placeholder: { es: "Detalla tu tipo de alimentación...", en: "Details on your eating habits..." }
    },
    {
      id: "q_32",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Tienes alergias o intolerancias alimenticias? (Ej.: gluten, lactosa)", en: "Any food allergies or intolerances? (e.g., gluten, lactose)" },
      placeholder: { es: "Lactosa, mariscos, ninguna...", en: "Lactose, shellfish, none..." }
    },
    {
      id: "q_33",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Hay alimentos que prefieres evitar? (Especificar)", en: "Any foods you prefer to avoid? (Specify)" },
      placeholder: { es: "Carnes rojas, brócoli, ninguno...", en: "Red meat, broccoli, none..." }
    },
    {
      id: "q_34",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Qué alimentos prefieres incluir en tu dieta? (Ej.: pescados, carnes magras)", en: "Foods you prefer to include? (e.g., fish, lean meats, vegetables)" },
      placeholder: { es: "Pollo, salmón, avena, frutas...", en: "Chicken, salmon, oats, fruits..." }
    },
    {
      id: "q_35",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Tienes horarios específicos para tus comidas principales?", en: "Specific schedules for main meals? (Breakfast, lunch, dinner)" },
      placeholder: { es: "Desayuno 8am, Almuerzo 1pm, Cena 8pm", en: "Breakfast 8am, Lunch 1pm, Dinner 8pm" }
    },
    {
      id: "q_36",
      tipo: "text",
      inputType: "text",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Qué tan cómodo estás con reducir carbohidratos o grasas si fuera necesario?", en: "How comfortable are you with reducing carbs or fats if needed?" },
      placeholder: { es: "Muy cómodo / Prefiero cambios graduales...", en: "Very comfortable / Prefer gradual changes..." }
    },

    // SECCIÓN 6: SALUD GENERAL Y RESTRICCIONES
    {
      id: "q_37",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Salud General y Restricciones", en: "General Health and Restrictions" },
      ayuda: {
        es: "La salud siempre es la prioridad. Cuéntanos sobre cualquier condición o limitación para asegurarnos de que tu plan sea seguro y efectivo.",
        en: "Your health is always our priority. Tell us about any conditions or limitations to ensure your plan is safe and effective."
      }
    },
    {
      id: "q_38",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Tienes alguna condición médica diagnosticada? (Ej.: hipertensión, diabetes)", en: "Any diagnosed medical conditions? (e.g., hypertension, diabetes)" },
      placeholder: { es: "Ninguna / Especificar...", en: "None / Specify..." }
    },
    {
      id: "q_39",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Tomas medicamentos regularmente? (Especificar)", en: "Do you take medication regularly? (Specify)" },
      placeholder: { es: "Ninguno / Indicar nombres...", en: "None / Indicate names..." }
    },
    {
      id: "q_40",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Estás en tratamiento médico o fisioterapia actualmente?", en: "Currently undergoing medical treatment or physical therapy?" },
      opciones: {
        es: ["Sí", "No"],
        en: ["Yes", "No"]
      }
    },
    {
      id: "q_41",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: false,
      titulo: { es: "¿Has tenido problemas con entrenamientos previos? (Dolores, fatiga)", en: "Any issues with prior workouts? (Pain, fatigue)" },
      placeholder: { es: "Dolor lumbar, mareos, ninguno...", en: "Lower back pain, dizziness, none..." }
    },
    {
      id: "q_42",
      tipo: "textarea",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Tienes alguna lesión o condición actual que debamos considerar? (Ej.: post-operatorio)", en: "Current injuries or conditions we should consider? (e.g., post-surgery, chronic pain)" },
      placeholder: { es: "Describe lesiones en rodilla, hombro, columna o ninguna...", en: "Describe knee, shoulder, spine injuries or none..." }
    },

    // SECCIÓN 7: SUPLEMENTACIÓN Y PREFERENCIAS
    {
      id: "q_43",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Suplementación y Preferencias", en: "Supplementation and Preferences" },
      ayuda: {
        es: "Los suplementos pueden ser aliados poderosos. Indícanos tus hábitos actuales y tus intereses para incluir recomendaciones que complementen tu rutina.",
        en: "Supplements can be powerful allies. Tell us about your current habits and interests so we can include recommendations to complement your routine."
      }
    },
    {
      id: "q_44",
      tipo: "text",
      inputType: "text",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Utilizas suplementos actualmente? (Ej.: proteína, creatina, vitaminas)", en: "Do you currently use supplements? (e.g., protein, creatine, vitamins)" },
      placeholder: { es: "Proteína whey, creatina, ninguno...", en: "Whey protein, creatine, none..." }
    },
    {
      id: "q_45",
      tipo: "pills-radio",
      colSpan: 6,
      requerido: true,
      titulo: { es: "¿Estarías interesado en recomendaciones de suplementación?", en: "Interested in supplementation recommendations?" },
      opciones: {
        es: ["Sí", "No"],
        en: ["Yes", "No"]
      }
    },
    {
      id: "q_46",
      tipo: "pills-radio",
      colSpan: 12,
      requerido: true,
      titulo: { es: "¿Es usted alérgico a algún tipo de suplemento? De ser así indique:", en: "Are you allergic to any type of supplements? If so, indicate:" },
      opciones: {
        es: ["Sí", "No", "Tal vez"],
        en: ["Yes", "No", "Maybe"]
      }
    },

    // SECCIÓN 8: TÉRMINOS Y CONSENTIMIENTO
    {
      id: "q_47",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Permisos y Aceptación de Términos", en: "Permissions and Acceptance of Terms" },
      ayuda: {
        es: "Tu privacidad y confianza son primordiales.",
        en: "Your privacy and trust are paramount."
      }
    },
    {
      id: "q_48",
      tipo: "pills-radio",
      colSpan: 12,
      requerido: true,
      titulo: { es: "Consentimiento para Compartir Progreso y Testimonios (Opcional)", en: "Consent to Share Progress and Testimonials (Optional)" },
      opciones: {
        es: ["Sí", "No"],
        en: ["Yes", "No"]
      }
    },

    // SECCIÓN 9: PAGO Y COMPROBANTE
    {
      id: "q_49",
      tipo: "section",
      colSpan: 12,
      titulo: { es: "Método de Pago y Comprobante", en: "Payment Method & Receipt" },
      ayuda: {
        es: "Seleccione e inserte el método de pago realizado.\n(El pago debe ser realizado cada 30 días a partir de la fecha suscrita, SIN NINGÚN TIPO DE EXCEPCIONES)",
        en: "Select and insert your payment method.\n(Payment must be made every 30 days from the subscription date, WITHOUT ANY EXCEPTIONS)"
      }
    },
    {
      id: "q_50",
      tipo: "pills-radio",
      colSpan: 12,
      requerido: true,
      titulo: { es: "Método de Pago Utilizado", en: "Payment Method Used" },
      opciones: {
        es: [
          "Pago Movil",
          "Binance (USDT, CRYPTO) reverandgil@gmail.com apodo gilselenereverand",
          "Transferencia Bancaria (Consultar)",
          "Zelle (Consultar)",
          "Otros (Efectivo, etc)"
        ],
        en: [
          "Mobile Payment (Pago Móvil)",
          "Binance (USDT, CRYPTO) reverandgil@gmail.com nickname gilselenereverand",
          "Bank Transfer (Inquire)",
          "Zelle (Inquire)",
          "Other (Cash, etc.)"
        ]
      }
    },
    {
      id: "q_51",
      tipo: "file",
      colSpan: 12,
      requerido: false,
      titulo: { es: "Cargue su comprobante de pago", en: "Upload your proof of payment / receipt" },
      ayuda: {
        es: "Adjunte una captura o foto de su transferencia o comprobante (JPG, PNG, WEBP o PDF, máx. 10MB)",
        en: "Attach a screenshot or photo of your transfer or receipt (JPG, PNG, WEBP or PDF, max 10MB)"
      }
    }
  ]
};
