export type QuestionType = 'single-choice'

export interface QuestionOption {
  label: string
  value: string
}

export interface Question {
  id: string
  text: string
  subtext?: string
  type: QuestionType
  options: QuestionOption[]
  showIf?: (answers: Answers) => boolean
}

export interface Answers {
  [questionId: string]: string
}

export type ConfidenceLabel = 'Baja' | 'Media' | 'Alta' | 'Muy alta'

export interface FactorImpact {
  /** Stable question id — used for i18n lookup. Optional for sessions stored before this field was added. */
  questionId?: string
  /** Stable option value — used for i18n lookup of the description. */
  optionValue?: string
  /** Spanish factor label (legacy + fallback). */
  label: string
  impact: number
  /** Spanish option label (legacy + fallback). */
  description: string
}

export interface CalculationResult {
  estimatedValue: number
  rangeMin: number
  rangeMax: number
  confidenceLabel: ConfidenceLabel
  confidenceScore: number
  percentile: number
  factorBreakdown: FactorImpact[]
}

export type FeedbackType = 'correct' | 'too-high' | 'too-low' | 'no-answer' | 'exact'

export interface FeedbackData {
  sessionId: string
  estimatedValue: number
  feedbackType: FeedbackType
  realValue?: number
  timestamp: number
}

export interface StoredSession {
  sessionId: string
  answers: Answers
  result: CalculationResult
  isPreliminary: boolean
  completedAt: number
  modelVersion: string
}
