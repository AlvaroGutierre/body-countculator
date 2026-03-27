'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { StoredSession } from '@/types'
import { getSession } from '@/lib/storage'
import { useLocale } from '@/components/LocaleProvider'
import { TRANSLATIONS } from '@/lib/i18n'
import FeedbackModule from './FeedbackModule'
import LanguageSelector from '@/components/LanguageSelector'

const CONFIDENCE_STYLES = {
  Baja:      'text-zinc-500 border-zinc-800 bg-zinc-900',
  Media:     'text-amber-400 border-amber-900/40 bg-amber-950/20',
  Alta:      'text-emerald-400 border-emerald-900/40 bg-emerald-950/20',
  'Muy alta':'text-violet-400 border-violet-900/40 bg-violet-950/20',
}

/** Animates a number from 0 to target with ease-out cubic. */
function useCountUp(target: number, duration = 1200): number {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const start = Date.now()
    const tick = () => {
      const elapsed  = Date.now() - start
      const progress = Math.min(1, elapsed / duration)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return count
}

function ImpactBar({ impact }: { impact: number }) {
  const isPositive = impact >= 0
  const pct = Math.min(100, Math.abs(impact) * 20)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-24 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isPositive ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? '+' : ''}{impact.toFixed(1)}
      </span>
    </div>
  )
}

function fadeIn(delay: number, extraTranslate = false) {
  return {
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  }
}

export default function ResultsView() {
  const router = useRouter()
  const { locale } = useLocale()
  const T = TRANSLATIONS[locale]

  const [session, setSession] = useState<StoredSession | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const s = getSession()
    if (!s) { router.replace('/'); return }
    setSession(s)
    const t = setTimeout(() => setRevealed(true), 150)
    return () => clearTimeout(t)
  }, [router])

  const displayCount = useCountUp(revealed && session ? session.result.estimatedValue : 0)

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-1 w-16 rounded-full bg-white/20 animate-pulse" />
      </div>
    )
  }

  const { result, sessionId, isPreliminary } = session

  const show = (delay: number) => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(14px)',
    ...fadeIn(delay),
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-5 py-16">

      {/* Language selector */}
      <div className="fixed top-5 right-5 z-20">
        <LanguageSelector />
      </div>

      <div className="mx-auto max-w-lg space-y-10">

        {/* Header badge */}
        <div className="text-center" style={show(0)}>
          {isPreliminary ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-950/20 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-medium text-amber-400 tracking-wide">
                {T.results.preliminary}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-800/30 bg-violet-950/20 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              <span className="text-xs font-medium text-violet-400 tracking-wide">
                {T.results.refined}
              </span>
            </div>
          )}
        </div>

        {/* Main number — count-up */}
        <div className="text-center space-y-3">
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(8px)',
              transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 180ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) 180ms',
            }}
          >
            <span className="text-[7rem] font-black leading-none tracking-tighter text-white sm:text-[9rem]">
              {displayCount}
            </span>
          </div>
          <p className="text-sm text-zinc-500" style={show(600)}>
            {T.results.probableRange}:{' '}
            <span className="text-zinc-300 font-medium">
              {result.rangeMin}–{result.rangeMax}
            </span>
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 space-y-1.5"
            style={show(750)}
          >
            <p className="text-xs text-zinc-600">{T.results.percentileTitle}</p>
            <p className="text-2xl font-bold text-white">{result.percentile}º</p>
            <p className="text-xs text-zinc-600 leading-snug">
              {T.results.percentileDesc(result.percentile)}
            </p>
          </div>
          <div
            className={`rounded-2xl border p-5 space-y-1.5 ${CONFIDENCE_STYLES[result.confidenceLabel]}`}
            style={show(900)}
          >
            <p className="text-xs opacity-60">{T.results.confidenceTitle}</p>
            <p className="text-2xl font-bold">
              {T.confidence[result.confidenceLabel] ?? result.confidenceLabel}
            </p>
            <p className="text-xs opacity-50 leading-snug">{T.results.confidenceDesc}</p>
          </div>
        </div>

        {/* Factor breakdown */}
        {result.factorBreakdown.length > 0 && (
          <div
            className="rounded-2xl border border-white/8 bg-white/[0.025] p-6 space-y-5"
            style={show(1050)}
          >
            <h3 className="text-sm font-semibold text-white">{T.results.topFactors}</h3>
            <div className="space-y-4">
              {result.factorBreakdown.map((factor, i) => {
                const qid          = factor.questionId ?? ''
                const displayLabel = T.factorLabels[qid] ?? factor.label
                const displayDesc  =
                  (factor.optionValue && T.questions[qid]?.options[factor.optionValue])
                    ?? factor.description
                return (
                  <div
                    key={factor.label}
                    className="flex items-center justify-between gap-4"
                    style={show(1050 + i * 80)}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-300 truncate">{displayLabel}</p>
                      <p className="text-xs text-zinc-600">{displayDesc}</p>
                    </div>
                    <ImpactBar impact={factor.impact} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Feedback */}
        <div style={show(1300)}>
          <FeedbackModule sessionId={sessionId} estimatedValue={result.estimatedValue} />
        </div>

        {/* Restart */}
        <div className="text-center" style={show(1400)}>
          <button
            onClick={() => router.push('/')}
            className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
          >
            {T.results.restart}
          </button>
        </div>

      </div>
    </div>
  )
}
