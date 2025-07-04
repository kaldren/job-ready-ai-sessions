
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export interface InterviewSessionData {
  id: string
  job_title: string
  job_level: string
  job_industry: string
  questions: Array<{
    question: string
    answer: string
    timeSpent: number
  }>
  total_time: number
  started_at: string
  completed_at: string
  feedback: any
  created_at: string
}

export const useInterviewSessions = () => {
  const [sessions, setSessions] = useState<InterviewSessionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching interview sessions:', error)
      toast({
        title: "Error",
        description: "Failed to load interview history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSession = async (sessionData: any, feedback: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          job_title: sessionData.jobData.title,
          job_level: sessionData.jobData.level,
          job_industry: sessionData.jobData.industry,
          questions: sessionData.questions,
          total_time: sessionData.totalTime,
          started_at: sessionData.startTime.toISOString(),
          completed_at: sessionData.endTime.toISOString(),
          feedback: feedback
        })

      if (error) throw error

      toast({
        title: "Session Saved",
        description: "Your interview session has been saved to your history",
      })

      // Refresh sessions after saving
      fetchSessions()
    } catch (error) {
      console.error('Error saving interview session:', error)
      toast({
        title: "Error",
        description: "Failed to save interview session",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return {
    sessions,
    isLoading,
    saveSession,
    refetch: fetchSessions
  }
}
