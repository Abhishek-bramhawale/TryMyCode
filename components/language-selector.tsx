'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
]

interface LanguageSelectorProps {
  value?: string
  onChange?: (language: string) => void
}

export default function LanguageSelector({ value = 'javascript', onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border rounded-md bg-background hover:bg-accent"
      >
        <span>{languages.find(lang => lang.value === value)?.label || 'JavaScript'}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-md shadow-lg z-10">
          {languages.map((language) => (
            <button
              key={language.value}
              onClick={() => {
                onChange?.(language.value)
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 hover:bg-accent"
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}