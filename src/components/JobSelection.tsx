import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Briefcase, Building, TrendingUp, History, Sparkles } from 'lucide-react'
import LanguageSelector from '@/components/LanguageSelector'

interface JobSelectionProps {
  onJobSelected: (jobData: JobData) => void
  onViewHistory: () => void
}

export interface JobData {
  title: string
  level: string
  industry: string
}

const JobSelection = ({ onJobSelected, onViewHistory }: JobSelectionProps) => {
  const [jobTitle, setJobTitle] = useState('')
  const [jobLevel, setJobLevel] = useState('')
  const [jobIndustry, setJobIndustry] = useState('')

  const handleStartInterview = () => {
    if (jobTitle && jobLevel && jobIndustry) {
      const jobData: JobData = {
        title: jobTitle,
        level: jobLevel,
        industry: jobIndustry,
      }
      onJobSelected(jobData)
    } else {
      alert('Please fill in all the fields')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Interview Practice
        </h1>
        <p className="text-xl text-gray-600">
          Practice interviews with personalized AI feedback
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-8">
        <LanguageSelector />
      </div>

      {/* Job Selection Form */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            <Sparkles className="w-6 h-6 mr-2 inline-block" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="job-title" className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
              Job Title
            </Label>
            <Input
              id="job-title"
              placeholder="Software Engineer, Product Manager..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="job-level" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
              Experience Level
            </Label>
            <Select onValueChange={setJobLevel}>
              <SelectTrigger id="job-level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
                <SelectItem value="Executive Level">Executive Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="job-industry" className="flex items-center">
              <Building className="w-4 h-4 mr-2 text-gray-500" />
              Industry
            </Label>
            <Input
              id="job-industry"
              placeholder="Technology, Healthcare, Finance..."
              value={jobIndustry}
              onChange={(e) => setJobIndustry(e.target.value)}
            />
          </div>

          <Button
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-3 mt-4"
            onClick={handleStartInterview}
          >
            Start Interview
          </Button>
        </CardContent>
      </Card>

      {/* History Button */}
      <div className="mt-6 text-center">
        <Button variant="secondary" onClick={onViewHistory} className="w-full md:w-auto">
          <History className="w-4 h-4 mr-2" />
          View Interview History
        </Button>
      </div>
    </div>
  )
}

export default JobSelection
