import { v4 as uuidv4 } from 'uuid'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateUserId(): string {
  return uuidv4()
}

export const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java 13
  cpp: 54,        // C++ GCC 9.2.0
  c: 50,          // C GCC 9.2.0
  typescript: 74,  // TypeScript

} as const

export type SupportedLanguage = keyof typeof LANGUAGE_IDS

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}