
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mic, MicOff, Send, Clock, User, Bot } from 'lucide-react'
import { JobData } from './JobSelection'

interface InterviewSessionProps {
  jobData: JobData
  onSessionComplete: (sessionData: SessionData) => void
}

export interface SessionData {
  jobData: JobData
  questions: QuestionAnswer[]
  totalTime: number
  startTime: Date
  endTime: Date
}

interface QuestionAnswer {
  question: string
  answer: string
  timeSpent: number
}

const InterviewSession = ({ jobData, onSessionComplete }: InterviewSessionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [questions] = useState<string[]>([
    `Tell me about yourself and why you're interested in the ${jobData.title} position.`,
    `What experience do you have that makes you suitable for this ${jobData.level} role?`,
    `Describe a challenging project you worked on in the ${jobData.industry} industry.`,
    "What are your greatest strengths and how do they apply to this role?",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for us?"
  ])
  const [answers, setAnswers] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [sessionStartTime] = useState(new Date())
  const [questionStartTime, setQuestionStartTime] = useState(new Date())
  const [questionTimes, setQuestionTimes] = useState<number[]>([])

  const progress = ((currentQuestion + 1) / questions.length) * 100

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview in Progress</h2>
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
            <div className="text-sm text-gray-500">
              {formatTime(Date.now() - sessionStartTime.getTime())}
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
        <p>Take your time with each answer. This is your practice session!</p>
      </div>
    </div>
  )
}

export default InterviewSession
