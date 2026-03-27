'use client'

import { useState } from 'react'
import type { FeedbackType } from '@/types'
import { saveFeedback } from '@/lib/storage'
import { useLocale } from '@/components/LocaleProvider'
import { TRANSLATIONS } from '@/lib/i18n'

interface FeedbackModuleProps {
  sessionId: string
  estimatedValue: number
}

type Step = 'idle' | 'ask-real' | 'done'

export default function FeedbackModule({ sessionId, estimatedValue }: FeedbackModuleProps) {
  const { locale } = useLocale()
  const T = TRANSLATIONS[locale].feedback

  const [step, setStep]         = useState<Step>('idle')
  const [realValue, setRealValue] = useState('')

  const submit = (type: FeedbackType, real?: number) => {
    saveFeedback({
      sessionId,
      estimatedValue,
      feedbackType: type,
      realValue: real,
      timestamp: Date.now(),
    })
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <p className="text-sm text-zinc-400">{T.thanks}</p>
        <p className="mt-1 text-xs text-zinc-600">{T.thanksNote}</p>
      </div>
    )
  }

  if (step === 'ask-real') {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
        <p className="text-sm font-medium text-white">{T.whatReal}</p>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            max="999"
            placeholder={T.placeholder}
            value={realValue}
            onChange={(e) => setRealValue(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-white/30"
          />
          <button
            onClick={() => submit('exact', Number(realValue))}
            disabled={!realValue}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-opacity disabled:opacity-40"
          >
            {T.send}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => submit('too-low')}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs text-zinc-400 hover:border-white/20 hover:text-white transition-colors"
          >
            {T.higher}
          </button>
          <button
            onClick={() => submit('too-high')}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs text-zinc-400 hover:border-white/20 hover:text-white transition-colors"
          >
            {T.lower}
          </button>
        </div>
        <button
          onClick={() => setStep('idle')}
          className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
        >
          {T.cancel}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
      <p className="text-sm font-medium text-white">{T.question}</p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => submit('correct')}
          className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-3 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors text-left px-4"
        >
          {T.correct}
        </button>
        <button
          onClick={() => setStep('ask-real')}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm text-zinc-400 hover:border-white/20 hover:text-white transition-colors text-left px-4"
        >
          {T.wrong}
        </button>
        <button
          onClick={() => submit('no-answer')}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm text-zinc-600 hover:text-zinc-400 transition-colors text-left px-4"
        >
          {T.noAnswer}
        </button>
      </div>
    </div>
  )
}
