import { getSupabaseServer } from '@/lib/supabase-server'

export const revalidate = 60

export async function GET() {
  let supabase: ReturnType<typeof getSupabaseServer>
  try {
    supabase = getSupabaseServer()
  } catch {
    return Response.json({ submissions: null, feedbacks: null })
  }

  const { data, error } = await supabase.rpc('get_public_stats')
  if (error || !data) {
    console.error('[stats] rpc get_public_stats failed', error)
    return Response.json({ submissions: null, feedbacks: null })
  }

  return Response.json({
    submissions: (data as { submissions_count: number }).submissions_count,
    feedbacks: (data as { feedbacks_count: number }).feedbacks_count,
  })
}
