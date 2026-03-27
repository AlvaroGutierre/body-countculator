'use client'

import { useLocale } from '@/components/LocaleProvider'

export default function LanguageSelector() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5">
      <button
        onClick={() => setLocale('es')}
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
          locale === 'es'
            ? 'bg-white text-black'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
          locale === 'en'
            ? 'bg-white text-black'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        EN
      </button>
    </div>
  )
}
