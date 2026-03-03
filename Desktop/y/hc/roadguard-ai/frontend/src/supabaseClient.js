import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'your-supabase-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Helper function to fetch road reports
export async function fetchRoadReports() {
  try {
    const { data, error } = await supabase
      .from('road_reports')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching reports:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

// Helper function to get statistics
export async function getReportStats() {
  try {
    const { data, error } = await supabase
      .from('road_reports')
      .select('severity_level')

    if (error) {
      console.error('Error fetching stats:', error)
      return { total: 0, high: 0, medium: 0, low: 0 }
    }

    const stats = {
      total: data?.length || 0,
      high: data?.filter(r => r.severity_level === 'High').length || 0,
      medium: data?.filter(r => r.severity_level === 'Medium').length || 0,
      low: data?.filter(r => r.severity_level === 'Low').length || 0,
    }

    return stats
  } catch (err) {
    console.error('Error:', err)
    return { total: 0, high: 0, medium: 0, low: 0 }
  }
}
