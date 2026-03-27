---
name: bodycount_web_project
description: Arquitectura completa del proyecto bodycount-web: stack, tablas Supabase, i18n, preguntas, modelo, flujo
type: project
---

## Stack
- Next.js 16.2.1 (App Router), React 19, TypeScript, Tailwind CSS v4

## Branding
- Nombre visible: **Body Countculator** (no traducir)
- Metadata title: "Body Countculator"
- Badge landing: "Estimador heurístico · 100% anónimo" (i18n)

## i18n
- `lib/i18n.ts` → TRANSLATIONS { es, en } — todas las cadenas UI + traducciones de preguntas + factorLabels por id
- `components/LocaleProvider.tsx` → React context. Persiste en localStorage key `bc_locale`
- `components/LanguageSelector.tsx` → toggle ES/EN (aparece en landing, quiz y results)
- Patrón de uso: `const { locale } = useLocale(); const T = TRANSLATIONS[locale]`
- Fallback: `T.questions[q.id]?.text ?? question.text` (el texto en questions.ts es el fallback español)
- Factor breakdown: usa `T.factorLabels[factor.questionId]` para el label, `T.questions[qid]?.options[factor.optionValue]` para la descripción. Fallback a español para sesiones antiguas sin questionId.
- **Limitación conocida**: html lang="es" es estático. Sessions antiguas (sin questionId/optionValue en FactorImpact) muestran labels en español.

## Persistencia
- localStorage: `bc_session` (StoredSession), `bc_feedback`, `bc_locale`
- Supabase: tablas `submissions` y `feedback`, RPC `get_public_stats`
- `lib/storage.ts` — escribe en localStorage Y en Supabase de forma no bloqueante
- Landing page es 'use client' (necesario para useLocale + useStats con useEffect)

## Arquitectura de archivos clave
- `types/index.ts` — Question, Answers, CalculationResult, FeedbackData, StoredSession, ConfidenceLabel
- `lib/questions.ts` — ALL_QUESTIONS, BASE_QUESTION_IDS, getBaseQuestions(), getExtendedQuestions()
- `lib/model.ts` — MODEL_CONFIGS (v1.0), pesos por question_id/option_value, factorLabels
- `lib/calculator.ts` — calculate(), computeConfidenceLabel() (esta última ya no se usa en QuizFlow)
- `lib/i18n.ts` — TRANSLATIONS, getPrecisionLabel()
- `lib/population.ts` — población sintética log-normal para percentil
- `lib/storage.ts` — saveSession(), getSession(), saveFeedback()
- `components/LocaleProvider.tsx`, `components/LanguageSelector.tsx`
- `components/quiz/QuizFlow.tsx` — 3 fases: base → midpoint → extended
- `components/quiz/ProgressBar.tsx` — props: current, total, overallPct (usa overallPct para precisión)
- `components/quiz/QuestionCard.tsx` — usa i18n para text/options
- `components/quiz/MidpointScreen.tsx` — usa i18n
- `components/results/ResultsView.tsx` — emoji por rango, usa i18n, LanguageSelector
- `components/results/FeedbackModule.tsx` — usa i18n

## Modelo de preguntas (v1.0)
- BASE (8-9): age, sex, orientation, long_relationships, social_life, dating_apps, university, erasmus (showIf university=si), attractiveness
- EXTENDED universal: dating_frequency, extraversion, nightlife, tattoos, living_environment, cultural_environment, economic_ease, image_care, fitness, **meeting_new_people**
- EXTENDED male-only: plays_sport, sport_level (showIf plays_sport=si)
- EXTENDED female-only: female_attention, female_selectivity, female_stories
- EXTENDED condicional: spontaneous_attention, easy_date, conversation_difficulty, social_circle_opportunities
- **hobbies_male ELIMINADO** → sustituido por meeting_new_people (universal, misma posición)
- economic_ease: texto "¿Cuál dirías que es tu nivel económico?", opciones Muy justo/Justo/Normal/Bien/Muy bien (values sin cambio: nada/poco/algo/bastante/mucho)

## Barra de precisión (overallPct)
- overallPct = Math.min(100, Math.round(answeredCount / 20 * 100))
- Etiquetas: 0-20 "Estimación inicial", 21-45 "Cogiendo contexto", 46-70 "Afinando precisión", 71-95 "Cálculo muy preciso", 96-100 "Resultado preparado"

## Emoji por resultado (ResultsView)
- 0 → 😇, 1-3 → 🙂, 4-8 → 😏, 9-15 → 🔥, 16+ → 😈

## Tono y estilo de preguntas
- Muy cortas y directas: "¿Sales mucho?" no "¿Cómo describirías tu vida social?"
- Flujo: base (rápidas, esenciales) → midpoint → extended (más señal, condicionales)
