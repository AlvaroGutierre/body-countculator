'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Locale } from '@/lib/i18n'

interface LocaleContextType {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'es',
  setLocale: () => {},
})

export function useLocale() {
  return useContext(LocaleContext)
}

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    const stored = localStorage.getItem('bc_locale') as Locale | null
    if (stored === 'es' || stored === 'en') {
      setLocaleState(stored)
    } else {
      const lang = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase()
      setLocaleState(lang.startsWith('es') ? 'es' : 'en')
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('bc_locale', l)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
