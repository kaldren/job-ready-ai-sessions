
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  FileText,
  ArrowLeft,
  Loader2,
  Play,
  Pause
} from 'lucide-react'
import { useInterviewSessions } from '@/hooks/useInterviewSessions'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ResumeSessionData } from './InterviewSession'

interface InterviewHistoryProps {
  onBack: () => void
  onResumeSession: (sessionData: ResumeSessionData) => void
}

const InterviewHistory = ({ onBack, onResumeSession }: InterviewHistoryProps) => {
  const { sessions, isLoading } = useInterviewSessions()
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions)
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId)
    } else {
      newExpanded.add(sessionId)
    }
    setExpandedSessions(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 1000 / 60)
    return `${minutes} min`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const isPausedSession = (session: any) => {
    return session.feedback && session.feedback.paused === true
  }

  const handleResumeSession = (session: any) => {
    if (!session.feedback?.resumeData) return
    
    const resumeData: ResumeSessionData = {
      id: session.id,
      jobData: {
        title: session.job_title,
        level: session.job_level,
        industry: session.job_industry
      },
      questions: session.feedback.resumeData.questions || [],
      answers: session.feedback.resumeData.answers || [],
      currentQuestion: session.feedback.resumeData.currentQuestion || 0,
      questionTimes: session.feedback.resumeData.questionTimes || [],
      sessionStartTime: new Date(session.feedback.resumeData.sessionStartTime),
      isPaused: true
    }
    
    onResumeSession(resumeData)
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Interview History</h2>
        </div>
        
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading your interview history...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold text-gray-900">Interview History</h2>
      </div>

      {sessions.length === 0 ? (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Interview History</h3>
            <p className="text-gray-600 text-center">
              Complete your first interview to see your history here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <div 
                    className="cursor-pointer"
                    onClick={() => toggleSession(session.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {isPausedSession(session) ? (
                            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                              <Pause className="w-6 h-6 text-orange-600" />
                            </div>
                          ) : session.feedback?.overallScore ? (
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                              <span className={`text-lg font-bold ${getScoreColor(session.feedback.overallScore)}`}>
                                {session.feedback.overallScore}%
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                              <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <CardTitle className="text-lg">{session.job_title}</CardTitle>
                              {isPausedSession(session) && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  Paused
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {session.job_level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {session.job_industry}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(session.completed_at)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDuration(session.total_time)}
                          </div>
                          {expandedSessions.has(session.id) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {isPausedSession(session) && (
                      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-orange-900 mb-1">Paused Interview Session</h4>
                            <p className="text-sm text-orange-700">
                              You can resume this interview from question {(session.feedback?.currentQuestion || 0) + 1} of {session.questions.length}
                            </p>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleResumeSession(session)
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Resume Interview
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Performance Scores */}
                      {session.feedback && !isPausedSession(session) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Performance Breakdown
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">Communication</span>
                                <span className={`text-sm font-semibold ${getScoreColor(session.feedback.scores.communication)}`}>
                                  {session.feedback.scores.communication}%
                                </span>
                              </div>
                              <Progress value={session.feedback.scores.communication} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">Content Quality</span>
                                <span className={`text-sm font-semibold ${getScoreColor(session.feedback.scores.content)}`}>
                                  {session.feedback.scores.content}%
                                </span>
                              </div>
                              <Progress value={session.feedback.scores.content} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">Confidence</span>
                                <span className={`text-sm font-semibold ${getScoreColor(session.feedback.scores.confidence)}`}>
                                  {session.feedback.scores.confidence}%
                                </span>
                              </div>
                              <Progress value={session.feedback.scores.confidence} className="h-2" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Session Stats */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Session Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Questions {isPausedSession(session) ? 'Answered' : 'Total'}:</span>
                            <span className="font-medium">
                              {isPausedSession(session) 
                                ? `${(session.feedback?.currentQuestion || 0)} of ${session.questions.length}`
                                : session.questions.length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{formatDuration(session.total_time)}</span>
                          </div>
                          {!isPausedSession(session) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Avg. per Question:</span>
                              <span className="font-medium">
                                {formatDuration(session.total_time / session.questions.length)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Questions and Answers */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Questions & Answers</h4>
                      <div className="space-y-4">
                        {session.questions.map((qa: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4">
                            <div className="mb-2">
                              <span className="text-sm text-blue-600 font-medium">Question {index + 1}</span>
                              <p className="text-gray-900 mt-1">{qa.question}</p>
                            </div>
                            {qa.answer ? (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm text-gray-600 font-medium">Your Answer:</span>
                                <p className="text-gray-800 mt-1">{qa.answer}</p>
                                {qa.timeSpent && (
                                  <span className="text-xs text-gray-500">
                                    Time spent: {Math.floor(qa.timeSpent / 1000)} seconds
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <span className="text-sm text-yellow-700 font-medium">Not answered yet</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Summary */}
                    {session.feedback && !isPausedSession(session) && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                          <ul className="space-y-1">
                            {session.feedback.strengths.map((strength: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-yellow-700 mb-2">Areas for Improvement</h4>
                          <ul className="space-y-1">
                            {session.feedback.improvements.map((improvement: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default InterviewHistory
