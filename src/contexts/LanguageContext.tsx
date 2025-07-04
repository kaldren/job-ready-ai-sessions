
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  country: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', country: 'United States' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', country: 'Spain' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', country: 'France' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Germany' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', country: 'Italy' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', country: 'Brazil' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', country: 'Russia' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', country: 'China' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', country: 'Japan' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', country: 'South Korea' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', country: 'India' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', country: 'Bulgaria' },
]

interface LanguageContextType {
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
      try {
        const parsed = JSON.parse(savedLanguage)
        const found = SUPPORTED_LANGUAGES.find(lang => lang.code === parsed.code)
        if (found) return found
      } catch (error) {
        console.error('Error parsing saved language:', error)
      }
    }
    // Default to English
    return SUPPORTED_LANGUAGES[0]
  })

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage))
  }, [selectedLanguage])

  // Simple translation function - in a real app you'd use a proper i18n library
  const t = (key: string, fallback?: string) => {
    // For now, just return the fallback or key since we're focusing on LLM integration
    return fallback || key
  }

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
