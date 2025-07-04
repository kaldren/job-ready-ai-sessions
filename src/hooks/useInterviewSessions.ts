
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@clerk/clerk-react'

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
  user_id: string
}

export const useInterviewSessions = () => {
  const [sessions, setSessions] = useState<InterviewSessionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const saveInProgress = useRef(false)
  const { user: clerkUser } = useUser()

  const fetchSessions = async () => {
    try {
      if (!clerkUser) {
        console.log('No Clerk user, skipping session fetch')
        setSessions([])
        setIsLoading(false)
        return
      }

      console.log('Fetching sessions for Clerk user:', clerkUser.id)

      // First try to fetch all sessions and filter client-side
      const { data: allSessions, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('All sessions from database:', allSessions)

      // Filter sessions for current user
      const userSessions = (allSessions || []).filter(session => session.user_id === clerkUser.id)
      
      console.log('Filtered sessions for user:', userSessions)

      // Type assertion to handle the Json type from database
      const typedData = userSessions.map(session => ({
        ...session,
        questions: session.questions as Array<{
          question: string
          answer: string
          timeSpent: number
        }>,
        feedback: session.feedback as any
      }))

      setSessions(typedData)
    } catch (error) {
      console.error('Error fetching interview sessions:', error)
      setSessions([]) // Set empty array on error instead of keeping previous state
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
    // Prevent duplicate saves
    if (saveInProgress.current) {
      console.log('Save already in progress, skipping...')
      return
    }

    saveInProgress.current = true

    try {
      if (!clerkUser) {
        throw new Error('User not authenticated')
      }

      console.log('Saving session data:', sessionData)
      console.log('With feedback:', feedback)
      console.log('Using Clerk user ID:', clerkUser.id)

      // Ensure questions are in the right format
      const formattedQuestions = sessionData.questions.map((q: any) => ({
        question: q.question,
        answer: q.answer || '',
        timeSpent: q.timeSpent || 0
      }))

      const sessionToSave = {
        user_id: clerkUser.id, // Use Clerk user ID as string
        job_title: sessionData.jobData.title,
        job_level: sessionData.jobData.level,
        job_industry: sessionData.jobData.industry,
        questions: formattedQuestions,
        total_time: sessionData.totalTime,
        started_at: sessionData.startTime.toISOString(),
        completed_at: sessionData.endTime.toISOString(),
        feedback: feedback
      }

      console.log('Formatted session to save:', sessionToSave)

      const { data: insertedData, error } = await supabase
        .from('interview_sessions')
        .insert(sessionToSave)
        .select()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('Successfully saved session:', insertedData)

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
        description: `Failed to save interview session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      saveInProgress.current = false
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [clerkUser?.id]) // Depend on user ID specifically

  return {
    sessions,
    isLoading,
    saveSession,
    refetch: fetchSessions
  }
}
