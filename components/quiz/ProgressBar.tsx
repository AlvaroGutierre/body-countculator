'use client'

import { useLocale } from '@/components/LocaleProvider'
import { TRANSLATIONS, getPrecisionLabel } from '@/lib/i18n'

interface ProgressBarProps {
  current: number
  total: number
  /** Overall quiz completion percentage (0–100), drives the precision label. */
  overallPct: number
}

const PRECISION_COLOR = (pct: number) => {
  if (pct >= 96) return 'text-violet-400'
  if (pct >= 71) return 'text-emerald-400'
  if (pct >= 46) return 'text-amber-400'
  return 'text-zinc-500'
}

export default function ProgressBar({ current, total, overallPct }: ProgressBarProps) {
  const { locale } = useLocale()
  const T = TRANSLATIONS[locale]
  const precisionLabel = getPrecisionLabel(T.precision.ranges, overallPct)
  const colorClass = PRECISION_COLOR(overallPct)

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          {current} / {total}
        </span>
        <span className={`flex items-center gap-1.5 font-medium ${colorClass}`}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {T.precision.prefix} {precisionLabel}
        </span>
      </div>
      <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/70 transition-all duration-500 ease-out"
          style={{ width: `${overallPct}%` }}
        />
      </div>
    </div>
  )
}
