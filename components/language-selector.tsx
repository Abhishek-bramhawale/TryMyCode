'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import{ useStore} from '@/store/use-store'
import{ PROGRAMMING_LANGUAGES, DEFAULT_CODE_SAMPLES }from '@/lib/constants'

interface LanguageSelectorProps {
  value?: string
  onChange?: (language: string) => void
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentRoom, updateRoomLanguage, updateRoomCode } = useStore()
  
  const currentLanguage= value || currentRoom?.language ||'javascript'

  const handleLanguageChange=(language: string) => {
    updateRoomLanguage(language)
    
    const defaultCode = DEFAULT_CODE_SAMPLES[language as keyof typeof DEFAULT_CODE_SAMPLES] || DEFAULT_CODE_SAMPLES.javascript
    updateRoomCode(defaultCode)
    
    onChange?.(language)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border rounded-md bg-background hover:bg-accent"
      >
        <span>{PROGRAMMING_LANGUAGES.find(lang => lang.id === currentLanguage)?.name || 'JavaScript'}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-md shadow-lg z-10">
          {PROGRAMMING_LANGUAGES.map((language) => (
            <button
              key={language.id}
              onClick={()=> handleLanguageChange(language.id)}
              className="w-full text-left px-3 py-2 hover:bg-accent"
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}