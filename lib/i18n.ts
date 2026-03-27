export type Locale = 'es' | 'en'

export interface QuestionTranslation {
  text: string
  subtext?: string
  options: Record<string, string>
}

export interface Translations {
  landing: {
    badge: string
    brand: string
    title: string
    description: string
    cta: string
    ctaNote: string
    stats: { submissions: string; feedbacks: string; model: string }
    modelNote: string
  }
  quiz: {
    back: string
    phaseBase: string
    phaseExtended: string
    anonymous: string
  }
  precision: {
    prefix: string
    ranges: Array<{ min: number; label: string }>
  }
  midpoint: {
    badge: string
    withQuestions: (n: number) => string
    remaining: (n: number) => string
    confidenceLabel: string
    answeredLabel: string
    continueBtn: string
    viewBtn: string
  }
  confidence: Record<string, string>
  /** Short labels for the factor breakdown panel (keyed by question id). */
  factorLabels: Record<string, string>
  results: {
    preliminary: string
    refined: string
    probableRange: string
    percentileTitle: string
    percentileDesc: (n: number) => string
    confidenceTitle: string
    confidenceDesc: string
    topFactors: string
    restart: string
  }
  feedback: {
    question: string
    correct: string
    wrong: string
    noAnswer: string
    whatReal: string
    placeholder: string
    send: string
    higher: string
    lower: string
    cancel: string
    thanks: string
    thanksNote: string
  }
  questions: Record<string, QuestionTranslation>
}

const es: Translations = {
  landing: {
    badge: 'Estimador heurístico · 100% anónimo',
    brand: 'Body Countculator',
    title: '¿Cuántos\nhas tenido?',
    description:
      'Un algoritmo estima tu bodycount a partir de tu perfil.\nSin juicios. Sin registro. Solo datos.',
    cta: 'Empezar ahora',
    ctaNote: '~3 min · Completamente anónimo',
    stats: { submissions: 'estimaciones', feedbacks: 'feedbacks', model: 'modelo actual' },
    modelNote:
      'El modelo mejora con cada estimación. Los pesos actuales son heurísticos; cuando haya suficientes datos con feedback, se calibrarán por versión.',
  },
  quiz: {
    back: '← Anterior',
    phaseBase: 'Body Countculator',
    phaseExtended: 'Body Countculator',
    anonymous: 'Anónimo · Sin registro · Tus respuestas no salen del dispositivo',
  },
  precision: {
    prefix: 'Precisión:',
    ranges: [
      { min: 96, label: 'Resultado preparado' },
      { min: 71, label: 'Cálculo muy preciso' },
      { min: 46, label: 'Afinando precisión' },
      { min: 21, label: 'Cogiendo contexto' },
      { min: 0,  label: 'Estimación inicial' },
    ],
  },
  midpoint: {
    badge: 'Estimación preliminar',
    withQuestions: (n) => `Con ${n} preguntas, el rango es todavía amplio.`,
    remaining: (n) =>
      `${n} preguntas más reducirán el rango, subirán la confianza y desbloquearán el desglose de factores.`,
    confidenceLabel: 'Confianza actual',
    answeredLabel: 'Respondidas',
    continueBtn: 'Continuar y afinar →',
    viewBtn: 'Ver este resultado',
  },
  confidence: {
    Baja: 'Baja',
    Media: 'Media',
    Alta: 'Alta',
    'Muy alta': 'Muy alta',
  },
  factorLabels: {
    sex: 'Sexo',
    orientation: 'Orientación',
    long_relationships: 'Relaciones largas',
    current_relationship: 'Tiene pareja',
    current_relationship_length: 'Tiempo en pareja',
    social_life: 'Vida social',
    dating_apps: 'Apps de citas',
    university: 'Carrera universitaria',
    erasmus: 'Erasmus',
    attractiveness: 'Atractivo físico',
    dating_frequency: 'Frecuencia de citas',
    extraversion: 'Extroversión',
    nightlife: 'Vida nocturna',
    tattoos: 'Tatuajes',
    living_environment: 'Entorno',
    cultural_environment: 'Entorno cultural',
    economic_ease: 'Economía',
    image_care: 'Imagen personal',
    fitness: 'Deporte',
    meeting_new_people: 'Conocer gente',
    plays_sport: 'Deporte en equipo',
    sport_level: 'Nivel deportivo',
    female_attention: 'Atención recibida',
    female_selectivity: 'Selectividad',
    female_stories: 'Stories',
    spontaneous_attention: 'Flirteos',
    easy_date: 'Facilidad para citas',
    conversation_difficulty: 'Arrancar conversación',
    social_circle_opportunities: 'Círculo social',
  },
  results: {
    preliminary: 'Estimación preliminar',
    refined: 'Estimación refinada',
    probableRange: 'Rango probable',
    percentileTitle: 'Percentil',
    percentileDesc: (n) => `Por encima del ${n}% de perfiles comparables`,
    confidenceTitle: 'Confianza',
    confidenceDesc: 'Basado en las respuestas proporcionadas',
    topFactors: 'Factores más influyentes',
    restart: 'Volver al inicio',
  },
  feedback: {
    question: '¿Qué tan cerca estuvo la estimación?',
    correct: 'Acertó bastante bien',
    wrong: 'No acertó',
    noAnswer: 'Prefiero no decirlo',
    whatReal: '¿Cuál era el número real?',
    placeholder: 'Ej. 12',
    send: 'Enviar',
    higher: 'Era mayor',
    lower: 'Era menor',
    cancel: 'Cancelar',
    thanks: 'Gracias por tu feedback.',
    thanksNote: 'Nos ayuda a mejorar el modelo estimador.',
  },
  questions: {
    age: {
      text: '¿Cuántos años tienes?',
      options: {
        '<=20': '18–20', '21-23': '21–23', '24-26': '24–26',
        '27-30': '27–30', '31-35': '31–35', '36-45': '36–45', '>45': 'Más de 45',
      },
    },
    sex: {
      text: '¿Eres chico o chica?',
      options: { hombre: 'Chico', mujer: 'Chica', otro: 'Otro / prefiero no decirlo' },
    },
    orientation: {
      text: '¿Y tu orientación sexual?',
      options: {
        heterosexual: 'Hetero', homosexual: 'Gay / lesbiana',
        bisexual: 'Bisexual', otra: 'Otra / sin etiqueta',
      },
    },
    long_relationships: {
      text: '¿Cuántas relaciones largas has tenido?',
      subtext: 'Más de 3 meses.',
      options: { ninguna: 'Ninguna', una: 'Una', dos: 'Dos', tres_mas: 'Tres o más' },
    },
    current_relationship: {
      text: '¿Tienes pareja actualmente?',
      options: { no: 'No', si: 'Sí' },
    },
    current_relationship_length: {
      text: '¿Cuánto tiempo llevas con tu pareja?',
      options: {
        lt_1y: 'Menos de 1 año',
        '1_2y': 'Entre 1 y 2 años',
        '2_5y': 'Entre 2 y 5 años',
        gt_5y: 'Más de 5 años',
      },
    },
    social_life: {
      text: '¿Sales mucho?',
      options: { muy_baja: 'Casi nada', baja: 'Poco', normal: 'Normal', alta: 'Bastante', muy_alta: 'Muchísimo' },
    },
    dating_apps: {
      text: '¿Usas apps de citas?',
      subtext: 'Tinder, Bumble, Hinge, Grindr...',
      options: { nunca: 'No', a_veces: 'A veces', bastante: 'Sí, bastante', mucho: 'Todo el día' },
    },
    university: {
      text: '¿Has hecho carrera?',
      options: { si: 'Sí', no: 'No' },
    },
    erasmus: {
      text: '¿Te fuiste de Erasmus?',
      options: { si: 'Sí', no: 'No' },
    },
    attractiveness: {
      text: '¿Qué tal físicamente?',
      options: { muy_bajo: 'Mal', bajo: 'Tirando a mal', normal: 'Normal', alto: 'Bien', muy_alto: 'Muy bien' },
    },
    dating_frequency: {
      text: '¿Con qué frecuencia tienes citas?',
      options: {
        casi_nunca: 'Casi nunca', ocasionalmente: 'De vez en cuando',
        frecuencia: 'Bastante', muy_a_menudo: 'Muy a menudo',
      },
    },
    extraversion: {
      text: '¿Eres extrovertido/a?',
      options: { nada: 'Nada', poco: 'Poco', normal: 'Normal', bastante: 'Bastante', mucho: 'Mucho' },
    },
    nightlife: {
      text: '¿Sales de fiesta?',
      options: { casi_nunca: 'Casi nunca', a_veces: 'A veces', bastante: 'Bastante', mucho: 'Mucho' },
    },
    tattoos: {
      text: '¿Tienes tatuajes?',
      options: { ninguno: 'Ninguno', pocos: 'Alguno', varios: 'Varios', muchos: 'Muchos' },
    },
    living_environment: {
      text: '¿Dónde vives?',
      options: { pueblo: 'Pueblo', ciudad_mediana: 'Ciudad mediana', gran_ciudad: 'Gran ciudad' },
    },
    cultural_environment: {
      text: '¿Tu entorno es...?',
      options: { conservador: 'Conservador', intermedio: 'Intermedio', liberal: 'Liberal' },
    },
    economic_ease: {
      text: '¿Cuál dirías que es tu nivel económico?',
      options: { nada: 'Muy justo', poco: 'Justo', algo: 'Normal', bastante: 'Bien', mucho: 'Muy bien' },
    },
    image_care: {
      text: '¿Cuidas tu imagen?',
      options: { nada: 'Nada', poco: 'Poco', normal: 'Normal', bastante: 'Bastante', mucho: 'Mucho' },
    },
    fitness: {
      text: '¿Haces deporte?',
      options: { nada: 'No', poco: 'Poco', normal: 'Normal', bastante: 'Bastante', mucho: 'Mucho' },
    },
    meeting_new_people: {
      text: '¿Con qué frecuencia acabas conociendo gente nueva?',
      options: {
        casi_nunca: 'Casi nunca', a_veces: 'A veces',
        bastante: 'Bastante', muy_a_menudo: 'Muy a menudo',
      },
    },
    plays_sport: {
      text: '¿Juegas en equipo o compites?',
      options: { no: 'No', si: 'Sí' },
    },
    sport_level: {
      text: '¿A qué nivel?',
      options: { amateur: 'Amateur / local', regional: 'Regional', nacional: 'Nacional', alto_nivel: 'Alto nivel' },
    },
    female_attention: {
      text: '¿Te suelen entrar mucho?',
      options: { pocos: 'Poco', algunos: 'Algo', bastantes: 'Bastante', muchos: 'Mucho' },
    },
    female_selectivity: {
      text: '¿Eres selectiva?',
      options: { poco: 'Para nada', normal: 'Normal', bastante: 'Bastante', mucho: 'Mucho' },
    },
    female_stories: {
      text: '¿Subes stories?',
      options: {
        todos_dias: 'Todos los días', varias_semana: 'Varias veces por semana',
        pocas_mes: 'Pocas al mes', casi_nunca: 'Casi nunca',
      },
    },
    spontaneous_attention: {
      text: '¿Te flirtean cuando sales?',
      options: { casi_nunca: 'Casi nunca', a_veces: 'A veces', bastante: 'Bastante', mucho: 'Mucho' },
    },
    easy_date: {
      text: '¿Ligas cuando te lo propones?',
      options: { casi_nunca: 'Casi nunca', a_veces: 'A veces', bastante: 'Sí, bastante', casi_siempre: 'Siempre' },
    },
    conversation_difficulty: {
      text: '¿Te cuesta arrancar conversación?',
      options: { no: 'No, me sale natural', a_veces: 'A veces', bastante: 'Bastante', mucho: 'Mucho' },
    },
    social_circle_opportunities: {
      text: '¿Tu entorno o tus planes te facilitan conocer gente nueva?',
      options: { pocas: 'Pocas', algunas: 'Algunas', bastantes: 'Bastantes', muchas: 'Muchas' },
    },
  },
}

const en: Translations = {
  landing: {
    badge: 'Heuristic estimator · 100% anonymous',
    brand: 'Body Countculator',
    title: 'How many\nhave you had?',
    description:
      'An algorithm estimates your body count based on your profile.\nNo judgment. No sign-up. Just data.',
    cta: 'Start now',
    ctaNote: '~3 min · No sign-up · Your answers never leave your device',
    stats: { submissions: 'estimates', feedbacks: 'feedbacks', model: 'current model' },
    modelNote:
      'The model improves with each estimate. Current weights are heuristic; once enough feedback data is collected, they will be calibrated per version.',
  },
  quiz: {
    back: '← Back',
    phaseBase: 'Body Countculator',
    phaseExtended: 'Body Countculator',
    anonymous: 'Anonymous · No sign-up · Your answers never leave this device',
  },
  precision: {
    prefix: 'Precision:',
    ranges: [
      { min: 96, label: 'Result ready' },
      { min: 71, label: 'Highly precise' },
      { min: 46, label: 'Refining accuracy' },
      { min: 21, label: 'Building context' },
      { min: 0,  label: 'Initial estimate' },
    ],
  },
  midpoint: {
    badge: 'Preliminary estimate',
    withQuestions: (n) => `With ${n} questions, the range is still wide.`,
    remaining: (n) =>
      `${n} more questions will narrow the range, boost confidence, and unlock the factor breakdown.`,
    confidenceLabel: 'Current confidence',
    answeredLabel: 'Answered',
    continueBtn: 'Continue & refine →',
    viewBtn: 'See this result',
  },
  confidence: {
    Baja: 'Low',
    Media: 'Medium',
    Alta: 'High',
    'Muy alta': 'Very high',
  },
  factorLabels: {
    sex: 'Sex',
    orientation: 'Orientation',
    long_relationships: 'Serious relationships',
    current_relationship: 'Currently in a relationship',
    current_relationship_length: 'Relationship duration',
    social_life: 'Social life',
    dating_apps: 'Dating apps',
    university: 'University',
    erasmus: 'Study abroad',
    attractiveness: 'Physical attractiveness',
    dating_frequency: 'Date frequency',
    extraversion: 'Extraversion',
    nightlife: 'Nightlife',
    tattoos: 'Tattoos',
    living_environment: 'Environment',
    cultural_environment: 'Cultural context',
    economic_ease: 'Financial situation',
    image_care: 'Personal image',
    fitness: 'Exercise',
    meeting_new_people: 'Meeting people',
    plays_sport: 'Competitive sports',
    sport_level: 'Sport level',
    female_attention: 'Attention received',
    female_selectivity: 'Selectivity',
    female_stories: 'Stories',
    spontaneous_attention: 'Flirting',
    easy_date: 'Getting dates',
    conversation_difficulty: 'Starting conversations',
    social_circle_opportunities: 'Social circle',
  },
  results: {
    preliminary: 'Preliminary estimate',
    refined: 'Refined estimate',
    probableRange: 'Probable range',
    percentileTitle: 'Percentile',
    percentileDesc: (n) => `Higher than ${n}% of comparable profiles`,
    confidenceTitle: 'Confidence',
    confidenceDesc: 'Based on answers provided',
    topFactors: 'Most influential factors',
    restart: 'Back to home',
  },
  feedback: {
    question: 'How close was the estimate?',
    correct: 'Pretty accurate',
    wrong: 'Not accurate',
    noAnswer: 'Prefer not to say',
    whatReal: 'What was the real number?',
    placeholder: 'e.g. 12',
    send: 'Submit',
    higher: 'It was higher',
    lower: 'It was lower',
    cancel: 'Cancel',
    thanks: 'Thanks for your feedback.',
    thanksNote: 'It helps us improve the estimator model.',
  },
  questions: {
    age: {
      text: 'How old are you?',
      options: {
        '<=20': '18–20', '21-23': '21–23', '24-26': '24–26',
        '27-30': '27–30', '31-35': '31–35', '36-45': '36–45', '>45': 'Over 45',
      },
    },
    sex: {
      text: 'Are you a guy or a girl?',
      options: { hombre: 'Guy', mujer: 'Girl', otro: 'Other / prefer not to say' },
    },
    orientation: {
      text: 'And your sexual orientation?',
      options: {
        heterosexual: 'Straight', homosexual: 'Gay / lesbian',
        bisexual: 'Bisexual', otra: 'Other / no label',
      },
    },
    long_relationships: {
      text: 'How many serious relationships have you had?',
      subtext: 'Longer than 3 months.',
      options: { ninguna: 'None', una: 'One', dos: 'Two', tres_mas: 'Three or more' },
    },
    current_relationship: {
      text: 'Are you currently in a relationship?',
      options: { no: 'No', si: 'Yes' },
    },
    current_relationship_length: {
      text: 'How long have you been together?',
      options: {
        lt_1y: 'Less than 1 year',
        '1_2y': '1 to 2 years',
        '2_5y': '2 to 5 years',
        gt_5y: 'More than 5 years',
      },
    },
    social_life: {
      text: 'How active is your social life?',
      options: {
        muy_baja: 'Barely any', baja: 'Low', normal: 'Average',
        alta: 'Quite a lot', muy_alta: 'Very much',
      },
    },
    dating_apps: {
      text: 'Do you use dating apps?',
      subtext: 'Tinder, Bumble, Hinge, Grindr...',
      options: { nunca: 'No', a_veces: 'Sometimes', bastante: 'Yes, quite a lot', mucho: 'All the time' },
    },
    university: {
      text: 'Did you go to university?',
      options: { si: 'Yes', no: 'No' },
    },
    erasmus: {
      text: 'Did you study abroad?',
      options: { si: 'Yes', no: 'No' },
    },
    attractiveness: {
      text: 'How would you rate your looks?',
      options: {
        muy_bajo: 'Below average', bajo: 'Slightly below', normal: 'Average',
        alto: 'Good', muy_alto: 'Very good',
      },
    },
    dating_frequency: {
      text: 'How often do you go on dates?',
      options: {
        casi_nunca: 'Almost never', ocasionalmente: 'Occasionally',
        frecuencia: 'Fairly often', muy_a_menudo: 'Very often',
      },
    },
    extraversion: {
      text: 'How extroverted are you?',
      options: {
        nada: 'Not at all', poco: 'Slightly', normal: 'Average',
        bastante: 'Quite', mucho: 'Very',
      },
    },
    nightlife: {
      text: 'Do you go out to parties?',
      options: {
        casi_nunca: 'Almost never', a_veces: 'Sometimes',
        bastante: 'Fairly often', mucho: 'A lot',
      },
    },
    tattoos: {
      text: 'Do you have tattoos?',
      options: { ninguno: 'None', pocos: 'A couple', varios: 'Several', muchos: 'Many' },
    },
    living_environment: {
      text: 'Where do you live?',
      options: { pueblo: 'Small town', ciudad_mediana: 'Medium city', gran_ciudad: 'Big city' },
    },
    cultural_environment: {
      text: 'How would you describe your environment?',
      options: { conservador: 'Conservative', intermedio: 'Mixed', liberal: 'Liberal' },
    },
    economic_ease: {
      text: "How would you describe your financial situation?",
      options: {
        nada: 'Very tight', poco: 'Tight', algo: 'Average',
        bastante: 'Good', mucho: 'Very good',
      },
    },
    image_care: {
      text: 'Do you take care of your appearance?',
      options: {
        nada: 'Not at all', poco: 'Barely', normal: 'Average',
        bastante: 'Quite a lot', mucho: 'Very much',
      },
    },
    fitness: {
      text: 'Do you exercise?',
      options: {
        nada: 'No', poco: 'A little', normal: 'Average',
        bastante: 'Quite a lot', mucho: 'A lot',
      },
    },
    meeting_new_people: {
      text: 'How often do you end up meeting new people?',
      options: {
        casi_nunca: 'Almost never', a_veces: 'Sometimes',
        bastante: 'Fairly often', muy_a_menudo: 'Very often',
      },
    },
    plays_sport: {
      text: 'Do you play sports competitively?',
      options: { no: 'No', si: 'Yes' },
    },
    sport_level: {
      text: 'At what level?',
      options: {
        amateur: 'Amateur / local', regional: 'Regional',
        nacional: 'National', alto_nivel: 'Elite',
      },
    },
    female_attention: {
      text: 'Do people hit on you a lot?',
      options: { pocos: 'Rarely', algunos: 'Sometimes', bastantes: 'Quite often', muchos: 'A lot' },
    },
    female_selectivity: {
      text: 'Are you selective?',
      options: { poco: 'Not at all', normal: 'Average', bastante: 'Quite', mucho: 'Very much' },
    },
    female_stories: {
      text: 'Do you post stories?',
      options: {
        todos_dias: 'Every day', varias_semana: 'Several times a week',
        pocas_mes: 'A few times a month', casi_nunca: 'Almost never',
      },
    },
    spontaneous_attention: {
      text: 'Do people flirt with you when you go out?',
      options: {
        casi_nunca: 'Almost never', a_veces: 'Sometimes',
        bastante: 'Fairly often', mucho: 'A lot',
      },
    },
    easy_date: {
      text: 'When you try, do you usually get a date?',
      options: {
        casi_nunca: 'Almost never', a_veces: 'Sometimes',
        bastante: 'Yes, fairly easily', casi_siempre: 'Almost always',
      },
    },
    conversation_difficulty: {
      text: 'Do you struggle to start conversations?',
      options: {
        no: "No, it comes naturally", a_veces: 'Sometimes',
        bastante: 'Quite often', mucho: 'A lot',
      },
    },
    social_circle_opportunities: {
      text: 'Do your environment or plans make it easy to meet new people?',
      options: { pocas: 'Few', algunas: 'Some', bastantes: 'Quite a few', muchas: 'Many' },
    },
  },
}

export const TRANSLATIONS: Record<Locale, Translations> = { es, en }

export function getPrecisionLabel(
  ranges: Array<{ min: number; label: string }>,
  pct: number
): string {
  return ranges.find((r) => pct >= r.min)?.label ?? ranges[ranges.length - 1].label
}
