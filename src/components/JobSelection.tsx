import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Building, User, Play, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export interface JobData {
  title: string
  level: string
  industry: string
  instantFeedbackEnabled?: boolean
}

interface JobSelectionProps {
  onJobSelect: (jobData: JobData) => void
  onViewHistory: () => void
}

const JobSelection = ({ onJobSelect, onViewHistory }: JobSelectionProps) => {
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [industry, setIndustry] = useState('')
  const [instantFeedbackEnabled, setInstantFeedbackEnabled] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && level && industry) {
      onJobSelect({ 
        title, 
        level, 
        industry,
        instantFeedbackEnabled 
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {t('Tell us about the position')}
          </CardTitle>
          <p className="text-gray-600">
            {t('We\'ll generate personalized interview questions based on your role')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>{t('Job Title')}</span>
              </Label>
              <Input
                id="title"
                placeholder={t('e.g., Software Engineer, Marketing Manager, Sales Representative')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{t('Experience Level')}</span>
              </Label>
              <Select value={level} onValueChange={setLevel} required>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder={t('Select your experience level')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">{t('Entry Level (0-2 years)')}</SelectItem>
                  <SelectItem value="mid">{t('Mid Level (3-5 years)')}</SelectItem>
                  <SelectItem value="senior">{t('Senior Level (6-10 years)')}</SelectItem>
                  <SelectItem value="lead">{t('Lead/Principal (10+ years)')}</SelectItem>
                  <SelectItem value="executive">{t('Executive/C-Level')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>{t('Industry')}</span>
              </Label>
              <Input
                id="industry"
                placeholder={t('e.g., Technology, Healthcare, Finance, Education')}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="text-base"
                required
              />
            </div>

            {/* Instant Feedback Toggle */}
            <div className="space-y-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-800">{t('AI-Powered Instant Feedback')}</span>
                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                    {t('Premium Feature')}
                  </Badge>
                </div>
                <Switch
                  checked={instantFeedbackEnabled}
                  onCheckedChange={setInstantFeedbackEnabled}
                />
              </div>
              <p className="text-sm text-amber-700 leading-relaxed">
                {t('Get real-time AI feedback as you type your answers. This helps improve your responses during the interview but uses additional AI tokens.')}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 text-lg font-semibold"
              disabled={!title || !level || !industry}
            >
              <Play className="w-5 h-5 mr-2" />
              {t('Start Interview')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobSelection
