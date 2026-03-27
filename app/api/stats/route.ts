import { supabase } from '@/lib/supabase'

export const revalidate = 60

export async function GET() {
  if (!supabase) {
    return Response.json({ submissions: null, feedbacks: null })
  }

  const { data, error } = await supabase.rpc('get_public_stats')
  if (error || !data) {
    return Response.json({ submissions: null, feedbacks: null })
  }

  return Response.json({
    submissions: (data as { submissions_count: number }).submissions_count,
    feedbacks: (data as { feedbacks_count: number }).feedbacks_count,
  })
}
