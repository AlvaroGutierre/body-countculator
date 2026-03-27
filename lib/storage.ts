import type { Answers, FeedbackData, StoredSession, CalculationResult } from '@/types'
import { supabase } from '@/lib/supabase'
import { ACTIVE_MODEL_VERSION } from '@/lib/model'

/** Convenience re-export so callers don't need to import from lib/model directly. */
export const MODEL_VERSION = ACTIVE_MODEL_VERSION

const KEYS = {
  session: 'bc_session',
  feedback: 'bc_feedback',
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ── Session ──────────────────────────────────────────────────────────────────

export function saveSession(
  answers: Answers,
  result: CalculationResult,
  isPreliminary: boolean
): string {
  const sessionId = generateId()
  const session: StoredSession = {
    sessionId,
    answers,
    result,
    isPreliminary,
    completedAt: Date.now(),
    modelVersion: MODEL_VERSION,
  }

  // Local — keeps ResultsView working without a network round-trip
  localStorage.setItem(KEYS.session, JSON.stringify(session))

  // Remote — simple insert; sessionId is always fresh so no conflict is possible
  if (supabase) {
    supabase
      .from('submissions')
      .insert({
        session_id: sessionId,
        answers,
        result,
        is_preliminary: isPreliminary,
        completed_at: session.completedAt,
        model_version: MODEL_VERSION,
      })
      .then(({ error }) => {
        if (error) {
          console.error('[storage] submissions insert failed', {
            message: error.message,
            code: error.code,
            details: (error as { details?: string }).details,
            hint: (error as { hint?: string }).hint,
          })
        } else {
          console.log('[storage] submissions insert ok', sessionId)
        }
      })
  } else {
    console.warn('[storage] supabase client is null — submissions insert skipped')
  }

  return sessionId
}

export function getSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(KEYS.session)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.session)
}

// ── Feedback ─────────────────────────────────────────────────────────────────

export function saveFeedback(feedback: FeedbackData): void {
  // Local history
  try {
    const existing = getFeedbackHistory()
    existing.push(feedback)
    localStorage.setItem(KEYS.feedback, JSON.stringify(existing))
  } catch {
    // ignore storage quota errors
  }

  // Remote — simple insert; sessionId ties feedback to its submission
  if (supabase) {
    supabase
      .from('feedback')
      .insert({
        session_id: feedback.sessionId,
        estimated_value: feedback.estimatedValue,
        feedback_type: feedback.feedbackType,
        real_value: feedback.realValue ?? null,
        model_version: MODEL_VERSION,
        timestamp: feedback.timestamp,
      })
      .then(({ error }) => {
        if (error) {
          console.error('[storage] feedback insert failed', {
            message: error.message,
            code: error.code,
            details: (error as { details?: string }).details,
            hint: (error as { hint?: string }).hint,
          })
        } else {
          console.log('[storage] feedback insert ok', feedback.sessionId)
        }
      })
  } else {
    console.warn('[storage] supabase client is null — feedback insert skipped')
  }
}

export function getFeedbackHistory(): FeedbackData[] {
  try {
    const raw = localStorage.getItem(KEYS.feedback)
    return raw ? (JSON.parse(raw) as FeedbackData[]) : []
  } catch {
    return []
  }
}
