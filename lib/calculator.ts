import type { Answers, CalculationResult, FactorImpact, ConfidenceLabel } from '@/types'
import { ALL_QUESTIONS } from '@/lib/questions'
import { computePercentile } from '@/lib/population'
import { getActiveModelConfig } from '@/lib/model'

// Age × current-relationship-duration interaction.
// The additive weights can't express that a 5-year relationship at 22 leaves
// only ~2 "free" years before it started. This table adds an extra deduction
// that grows when youth and relationship length overlap significantly.
// Only young age buckets are listed; 27+ is already handled by the base weights.
const AGE_REL_INTERACTION: Partial<Record<string, Partial<Record<string, number>>>> = {
  '<=20':  {                  '2_5y': -1.0, gt_5y: -1.5 },
  '21-23': { '1_2y': -0.5,   '2_5y': -1.5, gt_5y: -2.0 },
  '24-26': {                  '2_5y': -0.5, gt_5y: -1.0 },
  '27-30': {                               gt_5y: -0.5  },
}

export function calculate(answers: Answers): CalculationResult {
  const config = getActiveModelConfig()
  const { adjustments, factorLabels, params } = config

  const impacts: FactorImpact[] = []
  let total = 0

  for (const question of ALL_QUESTIONS) {
    const answer = answers[question.id]
    if (!answer) continue

    const impact = adjustments[question.id]?.[answer] ?? 0
    const label  = factorLabels[question.id] ?? question.id
    const optionLabel = question.options.find((o) => o.value === answer)?.label ?? answer

    impacts.push({ questionId: question.id, optionValue: answer, label, impact, description: optionLabel })
    total += impact
  }

  // Apply age × relationship-length interaction if the user has a current partner.
  if (answers.current_relationship === 'si') {
    total += AGE_REL_INTERACTION[answers.age ?? '']?.[answers.current_relationship_length ?? ''] ?? 0
  }

  // If the user has a current partner they have at least 1 partner — floor accordingly.
  const floor = answers.current_relationship === 'si' ? 1 : 0
  const estimatedValue = Math.max(floor, Math.round(total))

  const answeredCount   = Object.keys(answers).length
  const confidenceScore = Math.min(1, answeredCount / params.referenceQuestionCount)

  const confidenceLabel: ConfidenceLabel =
    params.confidenceThresholds.find((t) => confidenceScore >= t.minScore)?.label ?? 'Baja'

  const spread =
    params.confidenceSpreads.find((s) => confidenceScore >= s.minScore)?.spread ?? 5

  const rangeMin = Math.max(0, estimatedValue - spread)
  const rangeMax = estimatedValue + spread

  const percentile = computePercentile(estimatedValue)

  // Top factors by absolute impact — skip the age baseline from the visual breakdown
  const factorBreakdown = [...impacts]
    .filter((f) => f.label !== factorLabels['age'])
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 5)

  return {
    estimatedValue,
    rangeMin,
    rangeMax,
    confidenceLabel,
    confidenceScore,
    percentile,
    factorBreakdown,
  }
}

/**
 * Lightweight confidence label for the live progress bar in QuizFlow.
 * Uses the same thresholds as calculate() — no need to hardcode them twice.
 */
export function computeConfidenceLabel(answeredCount: number): ConfidenceLabel {
  const { params } = getActiveModelConfig()
  const score = Math.min(1, answeredCount / params.referenceQuestionCount)
  return params.confidenceThresholds.find((t) => score >= t.minScore)?.label ?? 'Baja'
}
