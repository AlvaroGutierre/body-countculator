import type { Question, Answers } from '@/types'

// ── Base phase IDs ────────────────────────────────────────────────────────────
// 7 fixed questions + erasmus (conditional on university=sí) + attractiveness.
// → carrera=sí path:  9 questions
// → carrera=no path:  8 questions
export const BASE_QUESTION_IDS = [
  'age',
  'sex',
  'orientation',
  'long_relationships',
  'social_life',
  'dating_apps',
  'university',
  'erasmus',        // showIf: university === 'si'
  'attractiveness', // moved from extended — strong universal signal
] as const

// Returns the visible base questions given current answers.
export function getBaseQuestions(answers: Answers = {}): Question[] {
  return ALL_QUESTIONS.filter(
    (q) =>
      (BASE_QUESTION_IDS as readonly string[]).includes(q.id) &&
      (!q.showIf || q.showIf(answers))
  )
}

// Returns the visible extended questions (everything outside base) given answers.
export function getExtendedQuestions(answers: Answers): Question[] {
  return ALL_QUESTIONS.filter(
    (q) =>
      !(BASE_QUESTION_IDS as readonly string[]).includes(q.id) &&
      (!q.showIf || q.showIf(answers))
  )
}

// ── showIf helpers ────────────────────────────────────────────────────────────

const isMale   = (a: Answers) => a.sex === 'hombre'
const isFemale = (a: Answers) => a.sex === 'mujer'
const highSocialOrApps = (a: Answers) =>
  ['alta', 'muy_alta'].includes(a.social_life ?? '') ||
  ['bastante', 'mucho'].includes(a.dating_apps ?? '')

// ── All questions (base first, then extended) ─────────────────────────────────
// Weights / adjustments live in lib/model.ts — not here.
// This file defines only question structure: id, text, option labels and values.

export const ALL_QUESTIONS: Question[] = [

  // ── BASE ──────────────────────────────────────────────────────────────────

  {
    id: 'age',
    text: '¿Cuántos años tienes?',
    type: 'single-choice',
    options: [
      { label: '18–20',      value: '<=20'  },
      { label: '21–23',      value: '21-23' },
      { label: '24–26',      value: '24-26' },
      { label: '27–30',      value: '27-30' },
      { label: '31–35',      value: '31-35' },
      { label: '36–45',      value: '36-45' },
      { label: 'Más de 45',  value: '>45'   },
    ],
  },
  {
    id: 'sex',
    text: '¿Eres chico o chica?',
    type: 'single-choice',
    options: [
      { label: 'Chico',                      value: 'hombre' },
      { label: 'Chica',                      value: 'mujer'  },
      { label: 'Otro / prefiero no decirlo', value: 'otro'   },
    ],
  },
  {
    id: 'orientation',
    text: '¿Y tu orientación sexual?',
    type: 'single-choice',
    options: [
      { label: 'Hetero',           value: 'heterosexual' },
      { label: 'Gay / lesbiana',   value: 'homosexual'   },
      { label: 'Bisexual',         value: 'bisexual'     },
      { label: 'Otra / sin etiqueta', value: 'otra'      },
    ],
  },
  {
    id: 'long_relationships',
    text: '¿Cuántas relaciones largas has tenido?',
    subtext: 'Más de 3 meses.',
    type: 'single-choice',
    options: [
      { label: 'Ninguna',    value: 'ninguna'  },
      { label: 'Una',        value: 'una'      },
      { label: 'Dos',        value: 'dos'      },
      { label: 'Tres o más', value: 'tres_mas' },
    ],
  },
  {
    id: 'social_life',
    text: '¿Sales mucho?',
    type: 'single-choice',
    options: [
      { label: 'Casi nada',  value: 'muy_baja' },
      { label: 'Poco',       value: 'baja'     },
      { label: 'Normal',     value: 'normal'   },
      { label: 'Bastante',   value: 'alta'     },
      { label: 'Muchísimo',  value: 'muy_alta' },
    ],
  },
  {
    id: 'dating_apps',
    text: '¿Usas apps de citas?',
    subtext: 'Tinder, Bumble, Hinge, Grindr...',
    type: 'single-choice',
    options: [
      { label: 'No',          value: 'nunca'   },
      { label: 'A veces',     value: 'a_veces' },
      { label: 'Sí, bastante',value: 'bastante'},
      { label: 'Todo el día', value: 'mucho'   },
    ],
  },
  {
    id: 'university',
    text: '¿Has hecho carrera?',
    type: 'single-choice',
    options: [
      { label: 'Sí', value: 'si' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 'erasmus',
    text: '¿Te fuiste de Erasmus?',
    type: 'single-choice',
    showIf: (a) => a.university === 'si',
    options: [
      { label: 'Sí', value: 'si' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 'attractiveness',
    text: '¿Qué tal físicamente?',
    type: 'single-choice',
    options: [
      { label: 'Mal',           value: 'muy_bajo' },
      { label: 'Tirando a mal', value: 'bajo'     },
      { label: 'Normal',        value: 'normal'   },
      { label: 'Bien',          value: 'alto'     },
      { label: 'Muy bien',      value: 'muy_alto' },
    ],
  },

  // ── EXTENDED — universal ──────────────────────────────────────────────────

  {
    id: 'dating_frequency',
    text: '¿Con qué frecuencia tienes citas?',
    type: 'single-choice',
    options: [
      { label: 'Casi nunca',    value: 'casi_nunca'    },
      { label: 'De vez en cuando', value: 'ocasionalmente' },
      { label: 'Bastante',      value: 'frecuencia'    },
      { label: 'Muy a menudo',  value: 'muy_a_menudo'  },
    ],
  },
  {
    id: 'extraversion',
    text: '¿Eres extrovertido/a?',
    type: 'single-choice',
    options: [
      { label: 'Nada',    value: 'nada'    },
      { label: 'Poco',    value: 'poco'    },
      { label: 'Normal',  value: 'normal'  },
      { label: 'Bastante',value: 'bastante'},
      { label: 'Mucho',   value: 'mucho'   },
    ],
  },
  {
    id: 'nightlife',
    text: '¿Sales de fiesta?',
    type: 'single-choice',
    options: [
      { label: 'Casi nunca', value: 'casi_nunca' },
      { label: 'A veces',    value: 'a_veces'    },
      { label: 'Bastante',   value: 'bastante'   },
      { label: 'Mucho',      value: 'mucho'      },
    ],
  },
  {
    id: 'tattoos',
    text: '¿Tienes tatuajes?',
    type: 'single-choice',
    options: [
      { label: 'Ninguno', value: 'ninguno' },
      { label: 'Alguno',  value: 'pocos'   },
      { label: 'Varios',  value: 'varios'  },
      { label: 'Muchos',  value: 'muchos'  },
    ],
  },
  {
    id: 'living_environment',
    text: '¿Dónde vives?',
    type: 'single-choice',
    options: [
      { label: 'Pueblo',         value: 'pueblo'         },
      { label: 'Ciudad mediana', value: 'ciudad_mediana' },
      { label: 'Gran ciudad',    value: 'gran_ciudad'    },
    ],
  },
  {
    id: 'cultural_environment',
    text: '¿Tu entorno es...?',
    type: 'single-choice',
    options: [
      { label: 'Conservador', value: 'conservador' },
      { label: 'Intermedio',  value: 'intermedio'  },
      { label: 'Liberal',     value: 'liberal'     },
    ],
  },
  {
    id: 'economic_ease',
    text: '¿Cuál dirías que es tu nivel económico?',
    type: 'single-choice',
    options: [
      { label: 'Muy justo', value: 'nada'    },
      { label: 'Justo',     value: 'poco'    },
      { label: 'Normal',    value: 'algo'    },
      { label: 'Bien',      value: 'bastante'},
      { label: 'Muy bien',  value: 'mucho'   },
    ],
  },
  {
    id: 'image_care',
    text: '¿Cuidas tu imagen?',
    type: 'single-choice',
    options: [
      { label: 'Nada',    value: 'nada'    },
      { label: 'Poco',    value: 'poco'    },
      { label: 'Normal',  value: 'normal'  },
      { label: 'Bastante',value: 'bastante'},
      { label: 'Mucho',   value: 'mucho'   },
    ],
  },
  {
    id: 'fitness',
    text: '¿Haces deporte?',
    type: 'single-choice',
    options: [
      { label: 'No',      value: 'nada'    },
      { label: 'Poco',    value: 'poco'    },
      { label: 'Normal',  value: 'normal'  },
      { label: 'Bastante',value: 'bastante'},
      { label: 'Mucho',   value: 'mucho'   },
    ],
  },

  {
    id: 'meeting_new_people',
    text: '¿Con qué frecuencia conoces gente nueva?',
    type: 'single-choice',
    options: [
      { label: 'Casi nunca',   value: 'casi_nunca'   },
      { label: 'A veces',      value: 'a_veces'      },
      { label: 'Bastante',     value: 'bastante'     },
      { label: 'Muy a menudo', value: 'muy_a_menudo' },
    ],
  },

  // ── EXTENDED — male-specific ───────────────────────────────────────────────

  {
    id: 'plays_sport',
    text: '¿Juegas en equipo o compites?',
    type: 'single-choice',
    showIf: isMale,
    options: [
      { label: 'No', value: 'no' },
      { label: 'Sí', value: 'si' },
    ],
  },
  {
    id: 'sport_level',
    text: '¿A qué nivel?',
    type: 'single-choice',
    showIf: (a) => isMale(a) && a.plays_sport === 'si',
    options: [
      { label: 'Amateur / local', value: 'amateur'    },
      { label: 'Regional',        value: 'regional'   },
      { label: 'Nacional',        value: 'nacional'   },
      { label: 'Alto nivel',      value: 'alto_nivel' },
    ],
  },

  // ── EXTENDED — female-specific ────────────────────────────────────────────

  {
    id: 'female_attention',
    text: '¿Te suelen entrar mucho?',
    type: 'single-choice',
    showIf: (a) => isFemale(a) && !highSocialOrApps(a),
    options: [
      { label: 'Poco',     value: 'pocos'    },
      { label: 'Algo',     value: 'algunos'  },
      { label: 'Bastante', value: 'bastantes'},
      { label: 'Mucho',    value: 'muchos'   },
    ],
  },
  {
    id: 'female_selectivity',
    text: '¿Eres selectiva?',
    type: 'single-choice',
    showIf: isFemale,
    options: [
      { label: 'Para nada', value: 'poco'    },
      { label: 'Normal',    value: 'normal'  },
      { label: 'Bastante',  value: 'bastante'},
      { label: 'Mucho',     value: 'mucho'   },
    ],
  },
  {
    id: 'female_stories',
    text: '¿Subes stories?',
    type: 'single-choice',
    showIf: isFemale,
    options: [
      { label: 'Todos los días',         value: 'todos_dias'   },
      { label: 'Varias veces por semana',value: 'varias_semana'},
      { label: 'Pocas al mes',           value: 'pocas_mes'    },
      { label: 'Casi nunca',             value: 'casi_nunca'   },
    ],
  },

  // ── EXTENDED — conditional ────────────────────────────────────────────────

  {
    id: 'spontaneous_attention',
    text: '¿Te flirtean cuando sales?',
    type: 'single-choice',
    showIf: highSocialOrApps,
    options: [
      { label: 'Casi nunca', value: 'casi_nunca' },
      { label: 'A veces',    value: 'a_veces'    },
      { label: 'Bastante',   value: 'bastante'   },
      { label: 'Mucho',      value: 'mucho'      },
    ],
  },
  {
    id: 'easy_date',
    text: '¿Consigues citas fácil?',
    type: 'single-choice',
    showIf: highSocialOrApps,
    options: [
      { label: 'Casi nunca',  value: 'casi_nunca'   },
      { label: 'A veces',     value: 'a_veces'      },
      { label: 'Sí, bastante',value: 'bastante'     },
      { label: 'Siempre',     value: 'casi_siempre' },
    ],
  },
  {
    id: 'conversation_difficulty',
    text: '¿Te cuesta arrancar conversación?',
    type: 'single-choice',
    showIf: (a) =>
      ['muy_baja', 'baja'].includes(a.social_life ?? '') &&
      ['nada', 'poco'].includes(a.extraversion ?? ''),
    options: [
      { label: 'No, me sale natural', value: 'no'       },
      { label: 'A veces',             value: 'a_veces'  },
      { label: 'Bastante',            value: 'bastante' },
      { label: 'Mucho',               value: 'mucho'    },
    ],
  },
  {
    id: 'social_circle_opportunities',
    text: '¿Tu círculo te da oportunidades de conocer gente?',
    type: 'single-choice',
    showIf: (a) =>
      a.living_environment === 'gran_ciudad' ||
      ['alta', 'muy_alta'].includes(a.social_life ?? ''),
    options: [
      { label: 'Pocas',    value: 'pocas'    },
      { label: 'Algunas',  value: 'algunas'  },
      { label: 'Bastantes',value: 'bastantes'},
      { label: 'Muchas',   value: 'muchas'   },
    ],
  },
]
