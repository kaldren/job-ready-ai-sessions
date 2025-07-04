
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, Users, TrendingUp, Palette, Shield, Stethoscope, Search, Building } from 'lucide-react'

interface JobSelectionProps {
  onJobSelected: (jobData: JobData) => void
}

export interface JobData {
  title: string
  level: string
  industry: string
  customTitle?: string
}

const jobCategories = [
  { icon: Code, title: "Software Engineer", color: "bg-blue-100 text-blue-600" },
  { icon: Users, title: "Product Manager", color: "bg-green-100 text-green-600" },
  { icon: TrendingUp, title: "Marketing Manager", color: "bg-purple-100 text-purple-600" },
  { icon: Palette, title: "UX/UI Designer", color: "bg-pink-100 text-pink-600" },
  { icon: Shield, title: "Cybersecurity Analyst", color: "bg-red-100 text-red-600" },
  { icon: Stethoscope, title: "Healthcare Professional", color: "bg-teal-100 text-teal-600" },
  { icon: Building, title: "Business Analyst", color: "bg-indigo-100 text-indigo-600" },
  { icon: Search, title: "Data Scientist", color: "bg-orange-100 text-orange-600" },
]

const JobSelection = ({ onJobSelected }: JobSelectionProps) => {
  const [selectedJob, setSelectedJob] = useState<string>('')
  const [customJob, setCustomJob] = useState<string>('')
  const [level, setLevel] = useState<string>('')
  const [industry, setIndustry] = useState<string>('')
  const [showCustom, setShowCustom] = useState(false)

  const handleSubmit = () => {
    if ((!selectedJob && !customJob) || !level || !industry) {
      return
    }

    const jobData: JobData = {
      title: customJob || selectedJob,
      level,
      industry,
      customTitle: customJob ? customJob : undefined
    }

    onJobSelected(jobData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What's your target role?</h2>
        <p className="text-lg text-gray-600">Tell us about the position you're preparing for</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Job Position</CardTitle>
          <CardDescription>Select or enter the role you want to practice for</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showCustom && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {jobCategories.map((job) => {
                const Icon = job.icon
                return (
                  <button
                    key={job.title}
                    onClick={() => setSelectedJob(job.title)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      selectedJob === job.title
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${job.color} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-sm text-center">{job.title}</p>
                  </button>
                )
              })}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowCustom(!showCustom)
                setSelectedJob('')
                setCustomJob('')
              }}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              {showCustom ? 'Choose from categories' : 'Enter custom role'}
            </Button>
          </div>

          {showCustom && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="customJob">Custom Job Title</Label>
                <Input
                  id="customJob"
                  placeholder="e.g., Senior React Developer, AI Research Scientist"
                  value={customJob}
                  onChange={(e) => setCustomJob(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Experience Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                  <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={(!selectedJob && !customJob) || !level || !industry}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 text-lg font-semibold shadow-lg"
          >
            Start Interview Practice
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobSelection
