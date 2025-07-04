
import { useState } from 'react'
import AuthLayout from '@/components/AuthLayout'
import JobSelection, { JobData } from '@/components/JobSelection'
import InterviewSession, { SessionData } from '@/components/InterviewSession'
import FeedbackReport from '@/components/FeedbackReport'

type AppState = 'job-selection' | 'interview' | 'feedback'

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

  return (
    <AuthLayout>
      {currentState === 'job-selection' && (
        <JobSelection onJobSelected={handleJobSelected} />
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
    </AuthLayout>
  )
}

export default Index
