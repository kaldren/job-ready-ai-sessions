
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Check } from 'lucide-react'
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '@/contexts/LanguageContext'

const LanguageSelector = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
  }

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Globe className="w-5 h-5 text-blue-600" />
          <span>Select Language</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose your preferred language for questions and feedback
        </p>
      </CardHeader>
      <CardContent>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12 text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedLanguage.flag}</span>
                <div>
                  <div className="font-medium">{selectedLanguage.nativeName}</div>
                  <div className="text-xs text-gray-500">{selectedLanguage.country}</div>
                </div>
              </div>
              <Badge variant="secondary" className="ml-2">
                {selectedLanguage.code.toUpperCase()}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className="flex items-center justify-between p-3 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-gray-500">{language.country}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {language.code.toUpperCase()}
                  </Badge>
                  {selectedLanguage.code === language.code && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}

export default LanguageSelector
