import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import LandingContent from './LandingContent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Body Countculator',
  description:
    'An algorithm estimates your body count based on your profile. Anonymous, no sign-up required.',
}

async function getStats(): Promise<{ submissions: number | null; feedbacks: number | null }> {
  if (!supabase) return { submissions: null, feedbacks: null }
  try {
    const { data, error } = await supabase.rpc('get_public_stats')
    if (error || !data) return { submissions: null, feedbacks: null }
    const s = data as { submissions_count: number; feedbacks_count: number }
    return { submissions: s.submissions_count, feedbacks: s.feedbacks_count }
  } catch {
    return { submissions: null, feedbacks: null }
  }
}

export default async function LandingPage() {
  const { submissions, feedbacks } = await getStats()
  return <LandingContent submissions={submissions} feedbacks={feedbacks} />
}
