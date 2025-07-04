
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
  Download
} from 'lucide-react'
import { SessionData } from './InterviewSession'

interface FeedbackReportProps {
  sessionData: SessionData
  onStartNew: () => void
}

const FeedbackReport = ({ sessionData, onStartNew }: FeedbackReportProps) => {
  const totalQuestions = sessionData.questions.length
  const averageTimePerQuestion = sessionData.totalTime / totalQuestions / 1000 / 60 // minutes
  const totalMinutes = Math.floor(sessionData.totalTime / 1000 / 60)

  // Mock scoring - in real app, this would come from AI analysis
  const overallScore = 78
  const communicationScore = 82
  const contentScore = 75
  const confidenceScore = 76

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
              <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Overall Performance</h3>
            <Badge className="bg-white text-gray-700">{getScoreBadge(overallScore)}</Badge>
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
                  <span className={`text-sm font-semibold ${getScoreColor(communicationScore)}`}>
                    {communicationScore}%
                  </span>
                </div>
                <Progress value={communicationScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Content Quality</span>
                  <span className={`text-sm font-semibold ${getScoreColor(contentScore)}`}>
                    {contentScore}%
                  </span>
                </div>
                <Progress value={contentScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <span className={`text-sm font-semibold ${getScoreColor(confidenceScore)}`}>
                    {confidenceScore}%
                  </span>
                </div>
                <Progress value={confidenceScore} className="h-2" />
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
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Clear and articulate communication style</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Good use of specific examples to support answers</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Demonstrated enthusiasm for the role</span>
              </li>
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
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Consider providing more quantifiable achievements</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Practice the STAR method for behavioral questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Prepare more detailed questions about the company</span>
              </li>
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
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Practice More Behavioral Questions</h4>
                  <p className="text-sm text-gray-600">Focus on STAR method responses with specific metrics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Research the Company</h4>
                  <p className="text-sm text-gray-600">Prepare thoughtful questions about the role and culture</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Mock Interview Practice</h4>
                  <p className="text-sm text-gray-600">Schedule practice sessions with peers or mentors</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Technical Preparation</h4>
                  <p className="text-sm text-gray-600">Review key concepts relevant to your target role</p>
                </div>
              </div>
            </div>
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
