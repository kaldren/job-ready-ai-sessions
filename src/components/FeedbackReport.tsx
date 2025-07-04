
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Target,
  Lightbulb,
  RotateCcw,
  Download,
  Loader2
} from 'lucide-react'
import { SessionData } from './InterviewSession'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface FeedbackReportProps {
  sessionData: SessionData
  onStartNew: () => void
}

interface AIFeedback {
  overallScore: number
  scores: {
    communication: number
    content: number
    confidence: number
  }
  strengths: string[]
  improvements: string[]
  recommendations: Array<{
    title: string
    description: string
  }>
}

const FeedbackReport = ({ sessionData, onStartNew }: FeedbackReportProps) => {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true)
  const { toast } = useToast()

  const totalQuestions = sessionData.questions.length
  const averageTimePerQuestion = sessionData.totalTime / totalQuestions / 1000 / 60 // minutes
  const totalMinutes = Math.floor(sessionData.totalTime / 1000 / 60)

  useEffect(() => {
    const generateFeedback = async () => {
      setIsLoadingFeedback(true)
      try {
        console.log('Generating AI feedback for session:', sessionData)
        
        const { data, error } = await supabase.functions.invoke('generate-feedback', {
          body: {
            jobTitle: sessionData.jobData.title,
            level: sessionData.jobData.level,
            industry: sessionData.jobData.industry,
            questions: sessionData.questions,
            totalTime: sessionData.totalTime
          }
        })

        if (error) {
          console.error('Supabase function error:', error)
          throw error
        }

        if (!data?.feedback) {
          throw new Error('Invalid response format from feedback generator')
        }

        console.log('Received AI feedback:', data.feedback)
        setFeedback(data.feedback)
        
        toast({
          title: "Feedback Generated",
          description: "Your personalized interview feedback is ready!",
        })

      } catch (error) {
        console.error('Error generating feedback:', error)
        toast({
          title: "Error",
          description: "Failed to generate personalized feedback. Using default analysis.",
          variant: "destructive",
        })
        
        // Fallback to mock feedback
        setFeedback({
          overallScore: 78,
          scores: {
            communication: 82,
            content: 75,
            confidence: 76
          },
          strengths: [
            "Clear and articulate communication style",
            "Good use of specific examples to support answers",
            "Demonstrated enthusiasm for the role"
          ],
          improvements: [
            "Consider providing more quantifiable achievements",
            "Practice the STAR method for behavioral questions",
            "Prepare more detailed questions about the company"
          ],
          recommendations: [
            {
              title: "Practice More Behavioral Questions",
              description: "Focus on STAR method responses with specific metrics"
            },
            {
              title: "Research the Company",
              description: "Prepare thoughtful questions about the role and culture"
            },
            {
              title: "Mock Interview Practice",
              description: "Schedule practice sessions with peers or mentors"
            },
            {
              title: "Technical Preparation",
              description: "Review key concepts relevant to your target role"
            }
          ]
        })
      } finally {
        setIsLoadingFeedback(false)
      }
    }

    generateFeedback()
  }, [sessionData, toast])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  if (isLoadingFeedback) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Performance</h2>
          <p className="text-lg text-gray-600">Our AI is reviewing your interview responses...</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating Personalized Feedback
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              Analyzing your answers, communication style, and performance to provide detailed insights...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unable to Generate Feedback</h2>
          <p className="text-lg text-gray-600 mb-8">There was an issue analyzing your interview. Please try again.</p>
          <Button onClick={onStartNew} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Interview
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Complete!</h2>
        <p className="text-lg text-gray-600">Here's your detailed performance analysis</p>
      </div>

      {/* Overall Score */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-green-50 mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4">
              <span className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Overall Performance</h3>
            <Badge className="bg-white text-gray-700">{getScoreBadge(feedback.overallScore)}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Session Stats */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Session Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Duration</span>
              <span className="font-semibold">{totalMinutes} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Answered</span>
              <span className="font-semibold">{totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Time per Question</span>
              <span className="font-semibold">{averageTimePerQuestion.toFixed(1)} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Position</span>
              <Badge variant="outline">{sessionData.jobData.title}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Communication</span>
                  <span className={`text-sm font-semibold ${getScoreColor(feedback.scores.communication)}`}>
                    {feedback.scores.communication}%
                  </span>
                </div>
                <Progress value={feedback.scores.communication} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Content Quality</span>
                  <span className={`text-sm font-semibold ${getScoreColor(feedback.scores.content)}`}>
                    {feedback.scores.content}%
                  </span>
                </div>
                <Progress value={feedback.scores.content} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <span className={`text-sm font-semibold ${getScoreColor(feedback.scores.confidence)}`}>
                    {feedback.scores.confidence}%
                  </span>
                </div>
                <Progress value={feedback.scores.confidence} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <Card className="shadow-lg border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="shadow-lg border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-700">
              <AlertCircle className="w-5 h-5" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Recommendations for Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedback.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onStartNew}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Interview
        </Button>
        <Button variant="outline" className="px-8 py-3">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  )
}

export default FeedbackReport
