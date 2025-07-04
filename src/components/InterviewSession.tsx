import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mic, MicOff, Send, Clock, User, Bot, Loader2, Pause, Play } from 'lucide-react'
import { JobData } from './JobSelection'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useInterviewSessions } from '@/hooks/useInterviewSessions'
import { useUser } from '@clerk/clerk-react'

interface InterviewSessionProps {
  jobData: JobData
  onSessionComplete: (sessionData: SessionData) => void
  resumeSession?: ResumeSessionData | null
}

export interface SessionData {
  jobData: JobData
  questions: QuestionAnswer[]
  totalTime: number
  startTime: Date
  endTime: Date
}

export interface ResumeSessionData {
  id: string
  jobData: JobData
  questions: string[]
  answers: string[]
  currentQuestion: number
  questionTimes: number[]
  sessionStartTime: Date
  isPaused: true
}

interface QuestionAnswer {
  question: string
  answer: string
  timeSpent: number
}

const InterviewSession = ({ jobData, onSessionComplete, resumeSession }: InterviewSessionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(resumeSession?.currentQuestion || 0)
  const [answer, setAnswer] = useState('')
  const [questions, setQuestions] = useState<string[]>(resumeSession?.questions || [])
  const [answers, setAnswers] = useState<string[]>(resumeSession?.answers || [])
  const [isRecording, setIsRecording] = useState(false)
  const [sessionStartTime] = useState(resumeSession?.sessionStartTime || new Date())
  const [questionStartTime, setQuestionStartTime] = useState(new Date())
  const [questionTimes, setQuestionTimes] = useState<number[]>(resumeSession?.questionTimes || [])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(!resumeSession)
  const [isPaused, setIsPaused] = useState(false)
  const [pausedSessionId, setPausedSessionId] = useState<string | null>(resumeSession?.id || null)
  const { toast } = useToast()
  const { saveSession } = useInterviewSessions()
  const { user: clerkUser } = useUser()

  useEffect(() => {
    if (resumeSession) {
      // Resume existing session
      setQuestions(resumeSession.questions)
      setAnswers(resumeSession.answers)
      setCurrentQuestion(resumeSession.currentQuestion)
      setQuestionTimes(resumeSession.questionTimes)
      setQuestionStartTime(new Date())
      setIsLoadingQuestions(false)
      return
    }

    const generateQuestions = async () => {
      setIsLoadingQuestions(true)
      try {
        console.log('Generating questions for job data:', jobData)
        
        const { data, error } = await supabase.functions.invoke('generate-questions', {
          body: {
            jobTitle: jobData.title,
            level: jobData.level,
            industry: jobData.industry
          }
        })

        if (error) {
          console.error('Supabase function error:', error)
          throw error
        }

        if (!data?.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid response format from question generator')
        }

        console.log(`Received ${data.questions.length} questions`)
        setQuestions(data.questions)
        setQuestionStartTime(new Date())
        
        toast({
          title: "Questions Generated",
          description: `Generated ${data.questions.length} personalized questions for your interview`,
        })

      } catch (error) {
        console.error('Error generating questions:', error)
        toast({
          title: "Error",
          description: "Failed to generate questions. Using fallback questions.",
          variant: "destructive",
        })
        
        // Fallback to basic questions if API fails
        setQuestions([
          `Tell me about yourself and why you're interested in the ${jobData.title} position.`,
          `What experience do you have that makes you suitable for this ${jobData.level} role?`,
          `Describe a challenging project you worked on in the ${jobData.industry} industry.`,
          "What are your greatest strengths and how do they apply to this role?",
          "Where do you see yourself in 5 years?",
          "Do you have any questions for us?"
        ])
      } finally {
        setIsLoadingQuestions(false)
      }
    }

    generateQuestions()
  }, [jobData, toast, resumeSession])

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  const handlePauseSession = async () => {
    try {
      console.log('Starting pause session process...')
      
      const timeSpent = Date.now() - questionStartTime.getTime()
      const currentAnswers = [...answers]
      const currentTimes = [...questionTimes]
      
      // If there's a current answer, include it in the paused state
      if (answer.trim()) {
        currentAnswers[currentQuestion] = answer
        currentTimes[currentQuestion] = timeSpent
      }

      console.log('Current answers:', currentAnswers)
      console.log('Current times:', currentTimes)

      // Use Clerk user instead of Supabase auth
      if (!clerkUser) {
        console.error('No Clerk user found')
        throw new Error('User not authenticated')
      }

      console.log('Clerk user authenticated:', clerkUser.id)

      // Format questions properly for database storage
      const formattedQuestions = questions.map((q, i) => ({
        question: q,
        answer: currentAnswers[i] || '',
        timeSpent: currentTimes[i] || 0
      }))

      console.log('Formatted questions:', formattedQuestions)

      // Create properly serialized resume data for the feedback field
      const resumeData = {
        jobData: {
          title: jobData.title,
          level: jobData.level,
          industry: jobData.industry
        },
        questions,
        answers: currentAnswers,
        currentQuestion,
        questionTimes: currentTimes,
        sessionStartTime: sessionStartTime.toISOString(),
        isPaused: true,
        totalTime: Date.now() - sessionStartTime.getTime()
      }

      console.log('Resume data prepared:', resumeData)

      const sessionData = {
        user_id: clerkUser.id,
        job_title: jobData.title,
        job_level: jobData.level,
        job_industry: jobData.industry,
        questions: formattedQuestions,
        total_time: Date.now() - sessionStartTime.getTime(),
        started_at: sessionStartTime.toISOString(),
        completed_at: new Date().toISOString(),
        feedback: { 
          paused: true,
          currentQuestion,
          resumeData
        }
      }

      console.log('Session data prepared:', JSON.stringify(sessionData, null, 2))

      let result;
      if (pausedSessionId) {
        // Update existing paused session
        console.log('Updating existing paused session with ID:', pausedSessionId)
        result = await supabase
          .from('interview_sessions')
          .update(sessionData)
          .eq('id', pausedSessionId)
          .eq('user_id', clerkUser.id)
          .select()
      } else {
        // Create new paused session
        console.log('Creating new paused session')
        result = await supabase
          .from('interview_sessions')
          .insert(sessionData)
          .select()
      }

      const { data: sessionResult, error } = result

      if (error) {
        console.error('Database operation error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('Successfully saved/updated session:', sessionResult)

      // Store the session ID for future updates
      if (sessionResult && sessionResult[0]) {
        setPausedSessionId(sessionResult[0].id)
      }

      toast({
        title: "Session Paused",
        description: pausedSessionId 
          ? "Your interview progress has been updated" 
          : "Your interview has been saved and can be resumed from history",
      })

      setIsPaused(true)
      
    } catch (error) {
      console.error('Error in handlePauseSession:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      toast({
        title: "Error",
        description: `Failed to pause session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  const handleNextQuestion = () => {
    const timeSpent = Date.now() - questionStartTime.getTime()
    const newAnswers = [...answers, answer]
    const newTimes = [...questionTimes, timeSpent]
    
    setAnswers(newAnswers)
    setQuestionTimes(newTimes)
    setAnswer('')

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setQuestionStartTime(new Date())
    } else {
      // Session complete
      const sessionData: SessionData = {
        jobData,
        questions: questions.map((q, i) => ({
          question: q,
          answer: newAnswers[i] || '',
          timeSpent: newTimes[i] || 0
        })),
        totalTime: Date.now() - sessionStartTime.getTime(),
        startTime: sessionStartTime,
        endTime: new Date()
      }
      onSessionComplete(sessionData)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, you'd implement actual voice recording here
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  if (isPaused) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="py-16">
            <Pause className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Paused</h2>
            <p className="text-gray-600 mb-6">
              Your interview session has been saved and can be resumed from your interview history.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              Return to Main Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoadingQuestions) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Preparing Your Interview</h2>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <Badge variant="outline" className="bg-blue-50">
              {jobData.title}
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              {jobData.level}
            </Badge>
            <Badge variant="outline" className="bg-purple-50">
              {jobData.industry}
            </Badge>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {resumeSession ? 'Resuming Interview Session' : 'Generating Personalized Questions'}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {resumeSession 
                ? 'Loading your previous interview session...'
                : 'Creating 30+ tailored interview questions based on your role, experience level, and industry...'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {resumeSession ? 'Resuming Interview' : 'Interview in Progress'}
        </h2>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <Badge variant="outline" className="bg-blue-50">
            {jobData.title}
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {jobData.level}
          </Badge>
          <Badge variant="outline" className="bg-purple-50">
            {jobData.industry}
          </Badge>
        </div>
      </div>

      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Question {currentQuestion + 1} of {questions.length}</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {formatTime(Date.now() - sessionStartTime.getTime())}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseSession}
                className="flex items-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Interviewer</h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  {questions[currentQuestion]}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Your Answer</h3>
            </div>
            
            <Textarea
              placeholder="Type your answer here... Take your time to think through your response."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-32 text-base leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={toggleRecording}
                className={`flex items-center space-x-2 ${
                  isRecording ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-600'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Voice Answer'}</span>
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={!answer.trim()}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Next Question
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Complete Interview
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        <p>Take your time with each answer. You can pause anytime and resume later from your history!</p>
      </div>
    </div>
  )
}

export default InterviewSession
