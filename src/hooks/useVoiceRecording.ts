
import { useState, useRef, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface UseVoiceRecordingProps {
  language?: string
}

export const useVoiceRecording = ({ language = 'en' }: UseVoiceRecordingProps = {}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      audioChunksRef.current = []
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)

      // Auto-stop after 20 seconds
      timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording()
          toast({
            title: "Recording Limit Reached",
            description: "Voice recording stopped after 20 seconds. You can continue typing your answer.",
          })
        }
      }, 20000)

      return true
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
      return false
    }
  }, [toast])

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
        resolve('')
        return
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false)
        setIsTranscribing(true)

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          
          if (audioBlob.size === 0) {
            resolve('')
            return
          }

          // Convert to base64 for sending to edge function
          const reader = new FileReader()
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1]
              
              const { data, error } = await supabase.functions.invoke('transcribe-audio', {
                body: { 
                  audio: base64Audio,
                  language: language // Pass the selected language
                }
              })

              if (error) {
                throw error
              }

              resolve(data.text || '')
            } catch (error) {
              console.error('Transcription error:', error)
              toast({
                title: "Transcription Error",
                description: "Could not transcribe audio. Please try again.",
                variant: "destructive",
              })
              resolve('')
            } finally {
              setIsTranscribing(false)
            }
          }

          reader.readAsDataURL(audioBlob)
        } catch (error) {
          console.error('Error processing audio:', error)
          setIsTranscribing(false)
          resolve('')
        }

        // Clean up media stream
        if (mediaRecorderRef.current?.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorderRef.current.stop()
    })
  }, [toast, language])

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      mediaRecorderRef.current.stop()
      
      // Clean up media stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
      
      setIsRecording(false)
      audioChunksRef.current = []
    }
  }, [])

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  }
}
