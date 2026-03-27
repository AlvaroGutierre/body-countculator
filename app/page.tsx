import type { Metadata } from 'next'
import LandingContent from './LandingContent'
import { getSupabaseServer } from '@/lib/supabase-server'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Body Countculator',
  description:
    'An algorithm estimates your body count based on your profile. Anonymous, no sign-up required.',
}

async function getStats(): Promise<{ submissions: number | null; feedbacks: number | null }> {
  try {
    const supabase = getSupabaseServer()

    const [
      { count: submissions, error: submissionsError },
      { count: feedbacks, error: feedbacksError },
    ] = await Promise.all([
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('*', { count: 'exact', head: true }),
    ])

    if (submissionsError) {
      console.error('Landing getStats - submissions error:', submissionsError)
    }

    if (feedbacksError) {
      console.error('Landing getStats - feedback error:', feedbacksError)
    }

    return {
      submissions: submissions ?? null,
      feedbacks: feedbacks ?? null,
    }
  } catch (err) {
    console.error('Landing getStats - exception:', err)
    return { submissions: null, feedbacks: null }
  }
}

export default async function LandingPage() {
  const { submissions, feedbacks } = await getStats()
  return <LandingContent submissions={submissions} feedbacks={feedbacks} />
}