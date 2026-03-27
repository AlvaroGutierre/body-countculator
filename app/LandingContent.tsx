'use client'

import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'
import LanguageSelector from '@/components/LanguageSelector'
import { TRANSLATIONS } from '@/lib/i18n'

interface LandingContentProps {
  submissions: number | null
  feedbacks: number | null
}

export default function LandingContent({ submissions, feedbacks }: LandingContentProps) {
  const { locale } = useLocale()
  const T = TRANSLATIONS[locale]
  const numberLocale = locale === 'es' ? 'es-ES' : 'en-US'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-20 bg-[#0a0a0a]">

      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120,80,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Language selector — top right */}
      <div className="fixed top-5 right-5 z-20">
        <LanguageSelector />
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs font-medium text-zinc-500 tracking-wide">
            {T.landing.badge}
          </span>
        </div>

        {/* Title block */}
        <div className="space-y-4">
          <h1 className="text-[1.8rem] font-black tracking-tighter leading-none text-white sm:text-[2.8rem] md:text-[5rem]">
            {T.landing.brand}
          </h1>
          <p className="text-2xl font-bold tracking-tight text-zinc-400 sm:text-3xl whitespace-pre-line leading-tight">
            {T.landing.title}
          </p>
          <p className="text-base text-zinc-500 leading-relaxed max-w-xs mx-auto whitespace-pre-line">
            {T.landing.description}
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold text-black shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {T.landing.cta}
            <span aria-hidden>→</span>
          </Link>
          <p className="text-xs text-zinc-700">
            {T.landing.ctaNote}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 pt-4 border-t border-white/5">
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {submissions !== null ? submissions.toLocaleString(numberLocale) : '—'}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">{T.landing.stats.submissions}</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {feedbacks !== null ? feedbacks.toLocaleString(numberLocale) : '—'}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">{T.landing.stats.feedbacks}</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-bold text-white">v1.0</p>
            <p className="text-xs text-zinc-600 mt-0.5">{T.landing.stats.model}</p>
          </div>
        </div>

        {/* Model note */}
        <p className="text-xs text-zinc-700 leading-relaxed">
          {T.landing.modelNote}
        </p>

      </div>
    </main>
  )
}
