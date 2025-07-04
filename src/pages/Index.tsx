
import { useState } from 'react'
import AuthLayout from '@/components/AuthLayout'
import JobSelection, { JobData } from '@/components/JobSelection'
import InterviewSession, { SessionData } from '@/components/InterviewSession'
import FeedbackReport from '@/components/FeedbackReport'
import InterviewHistory from '@/components/InterviewHistory'

type AppState = 'job-selection' | 'interview' | 'feedback' | 'history'

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('job-selection')
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  const handleJobSelected = (jobData: JobData) => {
    console.log('Job selected:', jobData)
    setSelectedJob(jobData)
    setCurrentState('interview')
  }

  const handleSessionComplete = (data: SessionData) => {
    console.log('Session completed:', data)
    setSessionData(data)
    setCurrentState('feedback')
  }

  const handleStartNew = () => {
    setCurrentState('job-selection')
    setSelectedJob(null)
    setSessionData(null)
  }

  const handleViewHistory = () => {
    setCurrentState('history')
  }

  const handleBackToSelection = () => {
    setCurrentState('job-selection')
  }

  return (
    <AuthLayout>
      {currentState === 'job-selection' && (
        <JobSelection 
          onJobSelected={handleJobSelected} 
          onViewHistory={handleViewHistory} 
        />
      )}
      
      {currentState === 'interview' && selectedJob && (
        <InterviewSession 
          jobData={selectedJob} 
          onSessionComplete={handleSessionComplete}
        />
      )}
      
      {currentState === 'feedback' && sessionData && (
        <FeedbackReport 
          sessionData={sessionData}
          onStartNew={handleStartNew}
        />
      )}

      {currentState === 'history' && (
        <InterviewHistory onBack={handleBackToSelection} />
      )}
    </AuthLayout>
  )
}

export default Index
