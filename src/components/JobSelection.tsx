
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            AI Interview Practice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master your next interview with personalized AI feedback and real-time coaching
          </p>
        </div>

        {/* Language Selector - Small dropdown in top right */}
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>

        {/* Job Selection Form */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5" />
          <CardHeader className="relative z-10 pb-8">
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-500" />
              Tell us about the role
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              We'll customize your interview experience based on this information
            </p>
          </CardHeader>
          <CardContent className="relative z-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="job-title" className="text-lg font-semibold flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Job Title
                </Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Software Engineer, Product Manager..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="h-12 text-lg border-2 focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="job-industry" className="text-lg font-semibold flex items-center">
                  <Building className="w-5 h-5 mr-2 text-green-600" />
                  Industry
                </Label>
                <Input
                  id="job-industry"
                  placeholder="e.g. Technology, Healthcare, Finance..."
                  value={jobIndustry}
                  onChange={(e) => setJobIndustry(e.target.value)}
                  className="h-12 text-lg border-2 focus:border-green-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="job-level" className="text-lg font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Experience Level
              </Label>
              <Select onValueChange={setJobLevel}>
                <SelectTrigger id="job-level" className="h-12 text-lg border-2 focus:border-purple-400">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level" className="text-lg">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="Mid Level" className="text-lg">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="Senior Level" className="text-lg">Senior Level (5+ years)</SelectItem>
                  <SelectItem value="Executive Level" className="text-lg">Executive Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              onClick={handleStartInterview}
            >
              Start Your AI Interview
            </Button>
          </CardContent>
        </Card>

        {/* History Button */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={onViewHistory} 
            className="bg-white/80 backdrop-blur-sm hover:bg-white border-2 px-8 py-3"
          >
            <History className="w-5 h-5 mr-2" />
            View Interview History
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JobSelection
