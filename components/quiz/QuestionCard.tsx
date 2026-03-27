'use client'

import type { Question } from '@/types'
import { useLocale } from '@/components/LocaleProvider'
import { TRANSLATIONS } from '@/lib/i18n'

interface QuestionCardProps {
  question: Question
  onAnswer: (value: string) => void
  selectedValue?: string
}

export default function QuestionCard({ question, onAnswer, selectedValue }: QuestionCardProps) {
  const { locale } = useLocale()
  const Q = TRANSLATIONS[locale].questions[question.id]

  const text    = Q?.text    ?? question.text
  const subtext = Q?.subtext ?? question.subtext

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Question text */}
      <div className="mb-10 space-y-2">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
          {text}
        </h2>
        {subtext && (
          <p className="text-sm text-zinc-500 leading-relaxed">{subtext}</p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const label = Q?.options[option.value] ?? option.label
          const isSelected = selectedValue === option.value
          return (
            <button
              key={option.value}
              onClick={() => onAnswer(option.value)}
              className={`
                group relative w-full rounded-xl border px-5 py-3.5 text-left text-sm font-medium
                transition-all duration-150 ease-out
                ${
                  isSelected
                    ? 'border-white/70 bg-white text-black shadow-sm'
                    : 'border-white/8 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                }
              `}
            >
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
