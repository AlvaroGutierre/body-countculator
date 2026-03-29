/**
 * Model configuration — versioned.
 *
 * This is the single source of truth for everything that can change
 * between model versions: adjustment weights, factor labels, and global
 * calculation parameters.
 *
 * To ship a new model version:
 *   1. Add a new entry to MODEL_CONFIGS (copy v1_0 and edit values).
 *   2. Change ACTIVE_MODEL_VERSION to point to it.
 *   3. Done. No other file needs to change.
 *
 * Future: load the active config from Supabase/remote at build time
 * (replace getActiveModelConfig body) to avoid a deploy for recalibrations.
 */

import type { ConfidenceLabel } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ModelParams {
  /** Number of questions considered "complete". Drives confidence score. */
  referenceQuestionCount: number
  /**
   * Confidence thresholds, ordered highest-first.
   * The first entry whose minScore ≤ confidenceScore is used.
   */
  confidenceThresholds: Array<{ minScore: number; label: ConfidenceLabel }>
  /**
   * Range spread (±N) by confidence. Ordered highest-first.
   * The first entry whose minScore ≤ confidenceScore is used.
   */
  confidenceSpreads: Array<{ minScore: number; spread: number }>
}

export interface ModelConfig {
  version: string
  /**
   * Adjustment weights: adjustments[questionId][optionValue] = delta.
   * Missing entries default to 0.
   */
  adjustments: Record<string, Record<string, number>>
  /** Human-readable label for each question id, used in the factor breakdown. */
  factorLabels: Record<string, string>
  params: ModelParams
}

// ── v1.0 — initial heuristic weights ─────────────────────────────────────────

const v1_0: ModelConfig = {
  version: '1.0',

  adjustments: {
    age: {
      '<=20': 2,
      '21-23': 4,
      '24-26': 6,
      '27-30': 8,
      '31-35': 9,
      '36-45': 10,
      '>45': 9,
    },
    sex: {
      hombre: 0,
      mujer: 0.5,
      otro: 0,
    },
    orientation: {
      heterosexual: 0,
      homosexual: 0.5,
      bisexual: 1.5,
      otra: 0,
    },
    long_relationships: {
      ninguna: -1,
      una: 0,
      dos: 1,
      tres_mas: 2,
    },
    current_relationship: {
      no: 0,
      si: -0.5,
    },
    current_relationship_length: {
      lt_1y:  0,
      '1_2y': -0.5,
      '2_5y': -1.0,
      gt_5y:  -1.5,
    },
    social_life: {
      muy_baja: -2,
      baja: -1,
      normal: 0,
      alta: 1.5,
      muy_alta: 3,
    },
    dating_apps: {
      nunca: -1,
      a_veces: 0.5,
      bastante: 2,
      mucho: 3,
    },
    university: {
      si: 1,
      no: 0,
    },
    erasmus: {
      si: 1.5,
      no: 0,
    },
    attractiveness: {
      muy_bajo: -1,
      bajo: -0.5,
      normal: 0,
      alto: 1,
      muy_alto: 2,
    },
    dating_frequency: {
      casi_nunca: -1.5,
      ocasionalmente: 0,
      frecuencia: 1.5,
      muy_a_menudo: 3,
    },
    extraversion: {
      nada: -1.5,
      poco: -0.5,
      normal: 0,
      bastante: 1,
      mucho: 2,
    },
    nightlife: {
      casi_nunca: -1,
      a_veces: 0,
      bastante: 1.5,
      mucho: 2.5,
    },
    tattoos: {
      ninguno: 0,
      pocos: 0.5,
      varios: 1,
      muchos: 1.5,
    },
    living_environment: {
      pueblo: -1,
      ciudad_mediana: 0,
      gran_ciudad: 1,
    },
    social_life_location: {
      pueblo: -0.5,  // vive y socializa en pueblo → refuerza penalización
      mixto:   0,    // neutral
      ciudad:  0.5,  // vive en pueblo pero socializa en ciudad → atenúa penalización
    },
    cultural_environment: {
      conservador: -2,
      intermedio: 0,
      liberal: 2,
    },
    economic_ease: {
      nada: -1,
      poco: -0.5,
      algo: 0,
      bastante: 1,
      mucho: 2,
    },
    image_care: {
      nada: -1,
      poco: -0.5,
      normal: 0,
      bastante: 1,
      mucho: 2,
    },
    fitness: {
      nada: -1,
      poco: -0.5,
      normal: 0,
      bastante: 1,
      mucho: 2,
    },
    meeting_new_people: {
      casi_nunca: -1.5,
      a_veces: 0,
      bastante: 1.5,
      muy_a_menudo: 3,
    },
    plays_sport: {
      no: 0,
      si: 0.5,
    },
    sport_level: {
      amateur: 0.5,
      regional: 1,
      nacional: 2,
      alto_nivel: 3,
    },
    female_attention: {
      pocos: -1,
      algunos: 0,
      bastantes: 1,
      muchos: 2,
    },
    female_selectivity: {
      poco: 1,
      normal: 0,
      bastante: -0.5,
      mucho: -1.5,
    },
    female_stories: {
      todos_dias: 1.5,
      varias_semana: 0.75,
      pocas_mes: 0,
      casi_nunca: -0.5,
    },
    spontaneous_attention: {
      casi_nunca: -1,
      a_veces: 0.5,
      bastante: 1.5,
      mucho: 2,
    },
    easy_date: {
      casi_nunca: -1,
      a_veces: 0,
      bastante: 1.5,
      casi_siempre: 2.5,
    },
    conversation_difficulty: {
      no: 0,
      a_veces: -0.5,
      bastante: -1,
      mucho: -1.5,
    },
    social_circle_opportunities: {
      pocas: -0.5,
      algunas: 0,
      bastantes: 0.75,
      muchas: 1.5,
    },
  },

  factorLabels: {
    age: 'Edad',
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
    social_life_location: 'Vida social (ubicación)',
    cultural_environment: 'Entorno cultural',
    economic_ease: 'Economía',
    image_care: 'Imagen personal',
    fitness: 'Deporte',
    meeting_new_people: 'Conocer gente',
    plays_sport: 'Juega deporte',
    sport_level: 'Nivel deportivo',
    female_attention: 'Atención recibida',
    female_selectivity: 'Selectividad',
    female_stories: 'Stories',
    spontaneous_attention: 'Flirteos',
    easy_date: 'Facilidad para citas',
    conversation_difficulty: 'Arrancar conversación',
    social_circle_opportunities: 'Círculo social',
  },

  params: {
    referenceQuestionCount: 20,
    // Ordered highest-first; first match wins
    confidenceThresholds: [
      { minScore: 0.85, label: 'Muy alta' },
      { minScore: 0.65, label: 'Alta' },
      { minScore: 0.45, label: 'Media' },
      { minScore: 0,    label: 'Baja' },
    ],
    // Ordered highest-first; first match wins
    confidenceSpreads: [
      { minScore: 0.8,  spread: 2 },
      { minScore: 0.55, spread: 3 },
      { minScore: 0,    spread: 5 },
    ],
  },
}

// ── Registry ──────────────────────────────────────────────────────────────────

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  '1.0': v1_0,
  // '1.1': v1_1,  ← add future versions here
}

export const ACTIVE_MODEL_VERSION = '1.0'

/**
 * Returns the active model config.
 *
 * Swap point for future remote loading:
 *   async function getActiveModelConfig(): Promise<ModelConfig> { ... }
 */
export function getActiveModelConfig(): ModelConfig {
  return MODEL_CONFIGS[ACTIVE_MODEL_VERSION]
}
