'use client'

import { useState, useEffect } from 'react'
import type { CalculationResult } from '@/types'
import { useLocale } from '@/components/LocaleProvider'
import { TRANSLATIONS } from '@/lib/i18n'

interface MidpointScreenProps {
  result: CalculationResult
  baseCount: number
  onViewResult: () => void
  onContinue: () => void
}

const CONFIDENCE_BADGE: Record<string, { bg: string; text: string }> = {
  Baja:      { bg: 'bg-zinc-800',         text: 'text-zinc-400'    },
  Media:     { bg: 'bg-amber-950/40',     text: 'text-amber-400'   },
  Alta:      { bg: 'bg-emerald-950/40',   text: 'text-emerald-400' },
  'Muy alta':{ bg: 'bg-violet-950/40',    text: 'text-violet-400'  },
}

export default function MidpointScreen({
  result,
  baseCount,
  onViewResult,
  onContinue,
}: MidpointScreenProps) {
  const { locale } = useLocale()
  const T = TRANSLATIONS[locale]
  const badge     = CONFIDENCE_BADGE[result.confidenceLabel]
  const remaining = 20 - baseCount

  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150)
    return () => clearTimeout(t)
  }, [])

  const show = (delay: number) => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-10">

        {/* Label */}
        <div className="text-center space-y-2" style={show(0)}>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-950/20 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-xs font-medium text-amber-400 tracking-wide">
              {T.midpoint.badge}
            </span>
          </div>
          <p className="text-sm text-zinc-600 pt-1">
            {T.midpoint.withQuestions(baseCount)}
          </p>
        </div>

        {/* Number */}
        <div className="text-center space-y-2">
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(8px)',
              transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 180ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) 180ms',
            }}
          >
            <span className="text-[7rem] font-black leading-none tracking-tighter text-white sm:text-[9rem]">
              {result.estimatedValue}
            </span>
          </div>
          <p className="text-sm text-zinc-500" style={show(600)}>
            {T.results.probableRange}:{' '}
            <span className="font-medium text-zinc-300">
              {result.rangeMin}–{result.rangeMax}
            </span>
          </p>
        </div>

        {/* Confidence + count */}
        <div
          className={`rounded-2xl border border-white/8 ${badge.bg} px-5 py-4 flex items-center justify-between`}
          style={show(750)}
        >
          <div>
            <p className="text-xs text-zinc-600 mb-0.5">{T.midpoint.confidenceLabel}</p>
            <p className={`text-lg font-bold ${badge.text}`}>
              {T.confidence[result.confidenceLabel] ?? result.confidenceLabel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-600 mb-0.5">{T.midpoint.answeredLabel}</p>
            <p className="text-lg font-bold text-white">{baseCount} / ~20</p>
          </div>
        </div>

        {/* Hint */}
        <div className="rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4" style={show(900)}>
          <p className="text-xs text-zinc-500 leading-relaxed text-center">
            {T.midpoint.remaining(remaining)}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3" style={show(1050)}>
          <button
            onClick={onContinue}
            className="w-full rounded-full bg-white py-4 text-sm font-bold text-black transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {T.midpoint.continueBtn}
          </button>
          <button
            onClick={onViewResult}
            className="w-full rounded-full border border-white/15 py-4 text-sm font-medium text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
          >
            {T.midpoint.viewBtn}
          </button>
        </div>

      </div>
    </div>
  )
}
