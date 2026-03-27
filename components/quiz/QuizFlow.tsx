'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Answers, CalculationResult } from '@/types'
import { getBaseQuestions, getExtendedQuestions } from '@/lib/questions'
import { calculate } from '@/lib/calculator'
import { saveSession } from '@/lib/storage'
import { useLocale } from '@/components/LocaleProvider'
import { TRANSLATIONS } from '@/lib/i18n'
import QuestionCard from './QuestionCard'
import ProgressBar from './ProgressBar'
import MidpointScreen from './MidpointScreen'
import LanguageSelector from '@/components/LanguageSelector'

type Phase = 'base' | 'midpoint' | 'extended'

const REFERENCE_COUNT = 20

// Glow layers — each activates at its precision threshold.
// Colors are intentionally subtle: black always dominates.
const GLOW_LAYERS = [
  { minPct: 0,  maxPct: 21,  rgb: '120,80,255',  alpha: 0.06 }, // purple  — estimación inicial
  { minPct: 21, maxPct: 46,  rgb: '234,179,8',   alpha: 0.07 }, // yellow  — cogiendo contexto
  { minPct: 46, maxPct: 71,  rgb: '245,158,11',  alpha: 0.08 }, // amber   — afinando
  { minPct: 71, maxPct: 96,  rgb: '16,185,129',  alpha: 0.08 }, // emerald — muy preciso
  { minPct: 96, maxPct: 101, rgb: '139,92,246',  alpha: 0.10 }, // violet  — resultado listo
] as const

function useTransition() {
  const [visible, setVisible] = useState(true)
  const [animating, setAnimating] = useState(false)

  const transition = useCallback((fn: () => void, duration = 260) => {
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      fn()
      setVisible(true)
      setAnimating(false)
    }, duration)
  }, [])

  return { visible, animating, transition }
}

export default function QuizFlow() {
  const router = useRouter()
  const { locale } = useLocale()
  const T = TRANSLATIONS[locale]

  const [phase, setPhase] = useState<Phase>('base')
  const [answers, setAnswers] = useState<Answers>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [preliminaryResult, setPreliminaryResult] = useState<CalculationResult | null>(null)
  const { visible, animating, transition } = useTransition()

  const baseQuestions     = useMemo(() => getBaseQuestions(answers), [answers])
  const extendedQuestions = useMemo(() => getExtendedQuestions(answers), [answers])

  const currentQuestion =
    phase === 'base'
      ? baseQuestions[currentIndex]
      : phase === 'extended'
        ? extendedQuestions[currentIndex]
        : null

  const overallPct = useMemo(
    () => Math.min(100, Math.round((Object.keys(answers).length / REFERENCE_COUNT) * 100)),
    [answers]
  )

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAnswer = useCallback(
    (value: string) => {
      if (animating || !currentQuestion) return

      const newAnswers = { ...answers, [currentQuestion.id]: value }

      // Set answers immediately so the selected option visually confirms
      // during the fade-out transition before the next question loads.
      setAnswers(newAnswers)

      if (phase === 'base') {
        const nextIndex = currentIndex + 1
        const nextBase  = getBaseQuestions(newAnswers)
        if (nextIndex < nextBase.length) {
          transition(() => setCurrentIndex(nextIndex))
        } else {
          const preliminary = calculate(newAnswers)
          transition(() => {
            setPreliminaryResult(preliminary)
            setPhase('midpoint')
          })
        }
      } else if (phase === 'extended') {
        const nextIndex    = currentIndex + 1
        const nextExtended = getExtendedQuestions(newAnswers)
        if (nextIndex < nextExtended.length) {
          transition(() => setCurrentIndex(nextIndex))
        } else {
          const finalResult = calculate(newAnswers)
          saveSession(newAnswers, finalResult, false)
          router.push('/results')
        }
      }
    },
    [animating, answers, currentIndex, currentQuestion, phase, router, transition]
  )

  const handleBack = useCallback(() => {
    if (animating) return
    if (phase === 'base' && currentIndex > 0) {
      transition(() => setCurrentIndex((i) => i - 1))
    } else if (phase === 'extended') {
      if (currentIndex > 0) {
        transition(() => setCurrentIndex((i) => i - 1))
      } else {
        transition(() => setPhase('midpoint'))
      }
    }
  }, [animating, currentIndex, phase, transition])

  const handleViewPreliminary = useCallback(() => {
    if (!preliminaryResult) return
    saveSession(answers, preliminaryResult, true)
    router.push('/results')
  }, [answers, preliminaryResult, router])

  const handleContinue = useCallback(() => {
    transition(() => {
      setPhase('extended')
      setCurrentIndex(0)
    })
  }, [transition])

  // ── Midpoint screen ────────────────────────────────────────────────────────

  if (phase === 'midpoint' && preliminaryResult) {
    return (
      <MidpointScreen
        result={preliminaryResult}
        baseCount={baseQuestions.length}
        onViewResult={handleViewPreliminary}
        onContinue={handleContinue}
      />
    )
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────

  if (!currentQuestion) return null

  const isBase        = phase === 'base'
  const totalForPhase = isBase ? baseQuestions.length : extendedQuestions.length

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] px-5 py-8">

      {/* Precision glow — top gradient that drifts, opacity crossfades between levels */}
      {GLOW_LAYERS.map((layer) => {
        const isActive = overallPct >= layer.minPct && overallPct < layer.maxPct
        return (
          <div
            key={layer.minPct}
            aria-hidden
            className="pointer-events-none fixed inset-x-0 top-0"
            style={{
              height: '55vh',
              background: `radial-gradient(ellipse 120% 70% at 50% -5%, rgba(${layer.rgb}, 0.20) 0%, transparent 65%)`,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1200ms ease',
            }}
          />
        )
      })}

      <div className="relative mx-auto w-full max-w-lg">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={phase === 'base' && currentIndex === 0}
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-400 disabled:opacity-0"
          >
            {T.quiz.back}
          </button>
          <span className="text-xs font-semibold tracking-widest text-zinc-600 uppercase">
            {isBase ? T.quiz.phaseBase : T.quiz.phaseExtended}
          </span>
          <LanguageSelector />
        </div>

        <ProgressBar
          current={currentIndex + 1}
          total={totalForPhase}
          overallPct={overallPct}
        />
      </div>

      <div className="relative flex flex-1 items-center justify-center py-12">
        <div
          className="w-full transition-all duration-200 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedValue={answers[currentQuestion.id]}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-lg">
        <p className="text-center text-xs text-zinc-800">
          {T.quiz.anonymous}
        </p>
      </div>
    </div>
  )
}
