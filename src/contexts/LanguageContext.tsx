
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

// Translation dictionary
const translations = {
  en: {
    // Main Page
    'AI Interview Practice': 'AI Interview Practice',
    'Master your next interview with personalized AI feedback and real-time coaching': 'Master your next interview with personalized AI feedback and real-time coaching',
    'Tell us about the role': 'Tell us about the role',
    'We\'ll customize your interview experience based on this information': 'We\'ll customize your interview experience based on this information',
    'Job Title': 'Job Title',
    'Industry': 'Industry',
    'Experience Level': 'Experience Level',
    'Start Your AI Interview': 'Start Your AI Interview',
    'View Interview History': 'View Interview History',
    'Entry Level (0-2 years)': 'Entry Level (0-2 years)',
    'Mid Level (2-5 years)': 'Mid Level (2-5 years)',
    'Senior Level (5+ years)': 'Senior Level (5+ years)',
    'Executive Level': 'Executive Level',
    'Select your experience level': 'Select your experience level',
    'Please fill in all the fields': 'Please fill in all the fields',
    
    // Interview Session
    'Preparing Your Interview': 'Preparing Your Interview',
    'Generating Personalized Questions': 'Generating Personalized Questions',
    'Creating 30+ tailored interview questions based on your role, experience level, and industry...': 'Creating 30+ tailored interview questions based on your role, experience level, and industry...',
    'Interview in Progress': 'Interview in Progress',
    'Resuming Interview': 'Resuming Interview',
    'Question': 'Question',
    'of': 'of',
    'Pause': 'Pause',
    'Instant AI Feedback': 'Instant AI Feedback',
    'Real-time': 'Real-time',
    'Interviewer': 'Interviewer',
    'Your Answer': 'Your Answer',
    'Type your answer here... Take your time to think through your response.': 'Type your answer here... Take your time to think through your response.',
    'AI Feedback': 'AI Feedback',
    'Analyzing your response...': 'Analyzing your response...',
    'Start typing to get instant feedback on your answer...': 'Start typing to get instant feedback on your answer...',
    'Voice Answer (20s max)': 'Voice Answer (20s max)',
    'Stop Recording': 'Stop Recording',
    'Transcribing...': 'Transcribing...',
    'Next Question': 'Next Question',
    'Complete Interview': 'Complete Interview',
    'Take your time with each answer. You can pause anytime and resume later from your history!': 'Take your time with each answer. You can pause anytime and resume later from your history!',
    'Recording... (stops automatically after 20 seconds)': 'Recording... (stops automatically after 20 seconds)',
    'Interview Paused': 'Interview Paused',
    'Your interview session has been saved and can be resumed from your interview history.': 'Your interview session has been saved and can be resumed from your interview history.',
    'Return to Main Menu': 'Return to Main Menu',
    'Questions Generated': 'Questions Generated',
    'Generated {count} personalized questions in {language}': 'Generated {count} personalized questions in {language}',
    'Error': 'Error',
    'Failed to generate questions. Using fallback questions.': 'Failed to generate questions. Using fallback questions.',
    'Session Paused': 'Session Paused',
    'Your interview progress has been updated': 'Your interview progress has been updated',
    'Your interview has been saved and can be resumed from history': 'Your interview has been saved and can be resumed from history',
    'Failed to pause session: {error}': 'Failed to pause session: {error}',
    
    // Job placeholders
    'e.g. Software Engineer, Product Manager...': 'e.g. Software Engineer, Product Manager...',
    'e.g. Technology, Healthcare, Finance...': 'e.g. Technology, Healthcare, Finance...',
  },
  es: {
    // Main Page
    'AI Interview Practice': 'Práctica de Entrevista con IA',
    'Master your next interview with personalized AI feedback and real-time coaching': 'Domina tu próxima entrevista con retroalimentación personalizada de IA y coaching en tiempo real',
    'Tell us about the role': 'Cuéntanos sobre el puesto',
    'We\'ll customize your interview experience based on this information': 'Personalizaremos tu experiencia de entrevista basada en esta información',
    'Job Title': 'Título del Trabajo',
    'Industry': 'Industria',
    'Experience Level': 'Nivel de Experiencia',
    'Start Your AI Interview': 'Comenzar tu Entrevista con IA',
    'View Interview History': 'Ver Historial de Entrevistas',
    'Entry Level (0-2 years)': 'Nivel Inicial (0-2 años)',
    'Mid Level (2-5 years)': 'Nivel Intermedio (2-5 años)',
    'Senior Level (5+ years)': 'Nivel Senior (5+ años)',
    'Executive Level': 'Nivel Ejecutivo',
    'Select your experience level': 'Selecciona tu nivel de experiencia',
    'Please fill in all the fields': 'Por favor completa todos los campos',
    
    // Interview Session
    'Preparing Your Interview': 'Preparando tu Entrevista',
    'Generating Personalized Questions': 'Generando Preguntas Personalizadas',
    'Creating 30+ tailored interview questions based on your role, experience level, and industry...': 'Creando más de 30 preguntas de entrevista adaptadas a tu rol, nivel de experiencia e industria...',
    'Interview in Progress': 'Entrevista en Progreso',
    'Resuming Interview': 'Reanudando Entrevista',
    'Question': 'Pregunta',
    'of': 'de',
    'Pause': 'Pausar',
    'Instant AI Feedback': 'Retroalimentación Instantánea de IA',
    'Real-time': 'Tiempo real',
    'Interviewer': 'Entrevistador',
    'Your Answer': 'Tu Respuesta',
    'Type your answer here... Take your time to think through your response.': 'Escribe tu respuesta aquí... Tómate tu tiempo para pensar en tu respuesta.',
    'AI Feedback': 'Retroalimentación de IA',
    'Analyzing your response...': 'Analizando tu respuesta...',
    'Start typing to get instant feedback on your answer...': 'Comienza a escribir para obtener retroalimentación instantánea sobre tu respuesta...',
    'Voice Answer (20s max)': 'Respuesta por Voz (máx. 20s)',
    'Stop Recording': 'Detener Grabación',
    'Transcribing...': 'Transcribiendo...',
    'Next Question': 'Siguiente Pregunta',
    'Complete Interview': 'Completar Entrevista',
    'Take your time with each answer. You can pause anytime and resume later from your history!': '¡Tómate tu tiempo con cada respuesta. Puedes pausar en cualquier momento y reanudar después desde tu historial!',
    'Recording... (stops automatically after 20 seconds)': 'Grabando... (se detiene automáticamente después de 20 segundos)',
    'Interview Paused': 'Entrevista Pausada',
    'Your interview session has been saved and can be resumed from your interview history.': 'Tu sesión de entrevista ha sido guardada y puede reanudarse desde tu historial de entrevistas.',
    'Return to Main Menu': 'Volver al Menú Principal',
    'Questions Generated': 'Preguntas Generadas',
    'Generated {count} personalized questions in {language}': 'Se generaron {count} preguntas personalizadas en {language}',
    'Error': 'Error',
    'Failed to generate questions. Using fallback questions.': 'Error al generar preguntas. Usando preguntas de respaldo.',
    'Session Paused': 'Sesión Pausada',
    'Your interview progress has been updated': 'Tu progreso de entrevista ha sido actualizado',
    'Your interview has been saved and can be resumed from history': 'Tu entrevista ha sido guardada y puede reanudarse desde el historial',
    'Failed to pause session: {error}': 'Error al pausar sesión: {error}',
    
    // Job placeholders
    'e.g. Software Engineer, Product Manager...': 'ej. Ingeniero de Software, Gerente de Producto...',
    'e.g. Technology, Healthcare, Finance...': 'ej. Tecnología, Salud, Finanzas...',
  },
  fr: {
    // Main Page
    'AI Interview Practice': 'Pratique d\'Entretien IA',
    'Master your next interview with personalized AI feedback and real-time coaching': 'Maîtrisez votre prochain entretien avec des commentaires IA personnalisés et un coaching en temps réel',
    'Tell us about the role': 'Parlez-nous du poste',
    'We\'ll customize your interview experience based on this information': 'Nous personnaliserons votre expérience d\'entretien basée sur ces informations',
    'Job Title': 'Titre du Poste',
    'Industry': 'Industrie',
    'Experience Level': 'Niveau d\'Expérience',
    'Start Your AI Interview': 'Commencer votre Entretien IA',
    'View Interview History': 'Voir l\'Historique des Entretiens',
    'Entry Level (0-2 years)': 'Niveau Débutant (0-2 ans)',
    'Mid Level (2-5 years)': 'Niveau Intermédiaire (2-5 ans)',
    'Senior Level (5+ years)': 'Niveau Senior (5+ ans)',
    'Executive Level': 'Niveau Exécutif',
    'Select your experience level': 'Sélectionnez votre niveau d\'expérience',
    'Please fill in all the fields': 'Veuillez remplir tous les champs',
    
    // Interview Session
    'Preparing Your Interview': 'Préparation de votre Entretien',
    'Generating Personalized Questions': 'Génération de Questions Personnalisées',
    'Creating 30+ tailored interview questions based on your role, experience level, and industry...': 'Création de plus de 30 questions d\'entretien adaptées à votre rôle, niveau d\'expérience et industrie...',
    'Interview in Progress': 'Entretien en Cours',
    'Resuming Interview': 'Reprise de l\'Entretien',
    'Question': 'Question',
    'of': 'sur',
    'Pause': 'Pause',
    'Instant AI Feedback': 'Commentaires IA Instantanés',
    'Real-time': 'Temps réel',
    'Interviewer': 'Recruteur',
    'Your Answer': 'Votre Réponse',
    'Type your answer here... Take your time to think through your response.': 'Tapez votre réponse ici... Prenez votre temps pour réfléchir à votre réponse.',
    'AI Feedback': 'Commentaires IA',
    'Analyzing your response...': 'Analyse de votre réponse...',
    'Start typing to get instant feedback on your answer...': 'Commencez à taper pour obtenir des commentaires instantanés sur votre réponse...',
    'Voice Answer (20s max)': 'Réponse Vocale (20s max)',
    'Stop Recording': 'Arrêter l\'Enregistrement',
    'Transcribing...': 'Transcription...',
    'Next Question': 'Question Suivante',
    'Complete Interview': 'Terminer l\'Entretien',
    'Take your time with each answer. You can pause anytime and resume later from your history!': 'Prenez votre temps avec chaque réponse. Vous pouvez faire une pause à tout moment et reprendre plus tard depuis votre historique !',
    'Recording... (stops automatically after 20 seconds)': 'Enregistrement... (s\'arrête automatiquement après 20 secondes)',
    'Interview Paused': 'Entretien en Pause',
    'Your interview session has been saved and can be resumed from your interview history.': 'Votre session d\'entretien a été sauvegardée et peut être reprise depuis votre historique d\'entretiens.',
    'Return to Main Menu': 'Retour au Menu Principal',
    'Questions Generated': 'Questions Générées',
    'Generated {count} personalized questions in {language}': '{count} questions personnalisées générées en {language}',
    'Error': 'Erreur',
    'Failed to generate questions. Using fallback questions.': 'Échec de la génération de questions. Utilisation de questions de secours.',
    'Session Paused': 'Session en Pause',
    'Your interview progress has been updated': 'Votre progression d\'entretien a été mise à jour',
    'Your interview has been saved and can be resumed from history': 'Votre entretien a été sauvegardé et peut être repris depuis l\'historique',
    'Failed to pause session: {error}': 'Échec de la pause de session : {error}',
    
    // Job placeholders
    'e.g. Software Engineer, Product Manager...': 'ex. Ingénieur Logiciel, Chef de Produit...',
    'e.g. Technology, Healthcare, Finance...': 'ex. Technologie, Santé, Finance...',
  },
  de: {
    // Main Page
    'AI Interview Practice': 'KI-Interview Übung',
    'Master your next interview with personalized AI feedback and real-time coaching': 'Meistern Sie Ihr nächstes Interview mit personalisiertem KI-Feedback und Echtzeit-Coaching',
    'Tell us about the role': 'Erzählen Sie uns über die Rolle',
    'We\'ll customize your interview experience based on this information': 'Wir passen Ihre Interview-Erfahrung basierend auf diesen Informationen an',
    'Job Title': 'Jobtitel',
    'Industry': 'Branche',
    'Experience Level': 'Erfahrungsstufe',
    'Start Your AI Interview': 'Ihr KI-Interview starten',
    'View Interview History': 'Interview-Verlauf anzeigen',
    'Entry Level (0-2 years)': 'Einstiegsstufe (0-2 Jahre)',
    'Mid Level (2-5 years)': 'Mittlere Stufe (2-5 Jahre)',
    'Senior Level (5+ years)': 'Senior-Stufe (5+ Jahre)',
    'Executive Level': 'Executive-Stufe',
    'Select your experience level': 'Wählen Sie Ihre Erfahrungsstufe',
    'Please fill in all the fields': 'Bitte füllen Sie alle Felder aus',
    
    // Interview Session
    'Preparing Your Interview': 'Ihr Interview wird vorbereitet',
    'Generating Personalized Questions': 'Personalisierte Fragen werden generiert',
    'Creating 30+ tailored interview questions based on your role, experience level, and industry...': 'Erstelle 30+ maßgeschneiderte Interview-Fragen basierend auf Ihrer Rolle, Erfahrungsstufe und Branche...',
    'Interview in Progress': 'Interview läuft',
    'Resuming Interview': 'Interview wird fortgesetzt',
    'Question': 'Frage',
    'of': 'von',
    'Pause': 'Pause',
    'Instant AI Feedback': 'Sofortiges KI-Feedback',
    'Real-time': 'Echtzeit',
    'Interviewer': 'Interviewer',
    'Your Answer': 'Ihre Antwort',
    'Type your answer here... Take your time to think through your response.': 'Geben Sie hier Ihre Antwort ein... Lassen Sie sich Zeit, um Ihre Antwort zu durchdenken.',
    'AI Feedback': 'KI-Feedback',
    'Analyzing your response...': 'Ihre Antwort wird analysiert...',
    'Start typing to get instant feedback on your answer...': 'Beginnen Sie zu tippen, um sofortiges Feedback zu Ihrer Antwort zu erhalten...',
    'Voice Answer (20s max)': 'Sprachantwort (max. 20s)',
    'Stop Recording': 'Aufnahme stoppen',
    'Transcribing...': 'Transkribieren...',
    'Next Question': 'Nächste Frage',
    'Complete Interview': 'Interview beenden',
    'Take your time with each answer. You can pause anytime and resume later from your history!': 'Lassen Sie sich Zeit mit jeder Antwort. Sie können jederzeit pausieren und später aus Ihrem Verlauf fortfahren!',
    'Recording... (stops automatically after 20 seconds)': 'Aufnahme... (stoppt automatisch nach 20 Sekunden)',
    'Interview Paused': 'Interview pausiert',
    'Your interview session has been saved and can be resumed from your interview history.': 'Ihre Interview-Sitzung wurde gespeichert und kann aus Ihrem Interview-Verlauf fortgesetzt werden.',
    'Return to Main Menu': 'Zurück zum Hauptmenü',
    'Questions Generated': 'Fragen generiert',
    'Generated {count} personalized questions in {language}': '{count} personalisierte Fragen in {language} generiert',
    'Error': 'Fehler',
    'Failed to generate questions. Using fallback questions.': 'Fehler beim Generieren von Fragen. Verwende Ersatzfragen.',
    'Session Paused': 'Sitzung pausiert',
    'Your interview progress has been updated': 'Ihr Interview-Fortschritt wurde aktualisiert',
    'Your interview has been saved and can be resumed from history': 'Ihr Interview wurde gespeichert und kann aus dem Verlauf fortgesetzt werden',
    'Failed to pause session: {error}': 'Fehler beim Pausieren der Sitzung: {error}',
    
    // Job placeholders
    'e.g. Software Engineer, Product Manager...': 'z.B. Software-Ingenieur, Produktmanager...',
    'e.g. Technology, Healthcare, Finance...': 'z.B. Technologie, Gesundheitswesen, Finanzen...',
  },
  bg: {
    // Main Page
    'AI Interview Practice': 'Практика за интервю с AI',
    'Master your next interview with personalized AI feedback and real-time coaching': 'Овладейте следващото си интервю с персонализирана обратна връзка от AI в реalno време',
    'Tell us about the role': 'Разкажете ни за позицията',
    'We\'ll customize your interview experience based on this information': 'Ще персонализираме вашето интервю въз основа на тази информация',
    'Job Title': 'Длъжност',
    'Industry': 'Индустрия',
    'Experience Level': 'Ниво на опит',
    'Start Your AI Interview': 'Започнете вашето AI интервю',
    'View Interview History': 'Преглед на история на интервютата',
    'Entry Level (0-2 years)': 'Начално ниво (0-2 години)',
    'Mid Level (2-5 years)': 'Средно ниво (2-5 години)',
    'Senior Level (5+ years)': 'Старше ниво (5+ години)',
    'Executive Level': 'Изпълнително ниво',
    'Select your experience level': 'Изберете вашето ниво на опит',
    'Please fill in all the fields': 'Моля, попълнете всички полета',
    
    // Interview Session
    'Preparing Your Interview': 'Подготвяне на вашето интервю',
    'Generating Personalized Questions': 'Генериране на персонализирани въпроси',
    'Creating 30+ tailored interview questions based on your role, experience level, and industry...': 'Създаваме 30+ персонализирани въпроси за интервю въз основа на вашата роля, ниво на опит и индустрия...',
    'Interview in Progress': 'Интервю в ход',
    'Resuming Interview': 'Възстановяване на интервю',
    'Question': 'Въпрос',
    'of': 'от',
    'Pause': 'Пауза',
    'Instant AI Feedback': 'Моментална обратна връзка от ИИ',
    'Real-time': 'Реално време',
    'Interviewer': 'Интервюиращ',
    'Your Answer': 'Вашият отговор',
    'Type your answer here... Take your time to think through your response.': 'Въведете вашия отговор тук... Отделете време да обмислите отговора си.',
    'AI Feedback': 'Обратна връзка от ИИ',
    'Analyzing your response...': 'Анализиране на вашия отговор...',
    'Start typing to get instant feedback on your answer...': 'Започнете да пишете, за да получите моментална обратна връзка за вашия отговор...',
    'Voice Answer (20s max)': 'Гласов отговор (макс. 20с)',
    'Stop Recording': 'Спри записа',
    'Transcribing...': 'Транскрибиране...',
    'Next Question': 'Следващ въпрос',
    'Complete Interview': 'Завърши интервюто',
    'Take your time with each answer. You can pause anytime and resume later from your history!': 'Отделете време за всеки отговор. Можете да направите пауза по всяко време и да продължите по-късно от вашата история!',
    'Recording... (stops automatically after 20 seconds)': 'Записване... (спира автоматично след 20 секунди)',
    'Interview Paused': 'Интервю на пауза',
    'Your interview session has been saved and can be resumed from your interview history.': 'Вашата сесия на интервю е запазена и може да бъде продължена от историята на интервютата.',
    'Return to Main Menu': 'Връщане към главното меню',
    'Questions Generated': 'Въпроси генерирани',
    'Generated {count} personalized questions in {language}': 'Генерирани {count} персонализирани въпроса на {language}',
    'Error': 'Грешка',
    'Failed to generate questions. Using fallback questions.': 'Неуспешно генериране на въпроси. Използват се резервни въпроси.',
    'Session Paused': 'Сесия на пауза',
    'Your interview progress has been updated': 'Вашият прогрес на интервю е актуализиран',
    'Your interview has been saved and can be resumed from history': 'Вашето интервю е запазено и може да бъде продължено от историята',
    'Failed to pause session: {error}': 'Неуспешна пауза на сесия: {error}',
    
    // Job placeholders
    'e.g. Software Engineer, Product Manager...': 'напр. Софтуерен инженер, Продуктов мениджър...',
    'e.g. Technology, Healthcare, Finance...': 'напр. Технологии, Здравеопазване, Финанси...',
  }
}

interface LanguageContextType {
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
  t: (key: string, interpolations?: Record<string, string | number>) => string
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

  // Translation function with interpolation support
  const t = (key: string, interpolations?: Record<string, string | number>) => {
    const languageCode = selectedLanguage.code
    const translation = translations[languageCode as keyof typeof translations]?.[key] || 
                       translations.en[key] || 
                       key

    // Handle interpolations like {count}, {language}, {error}
    if (interpolations) {
      return Object.entries(interpolations).reduce((str, [k, v]) => 
        str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)), translation
      )
    }

    return translation
  }

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
