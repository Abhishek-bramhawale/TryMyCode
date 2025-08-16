import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}


export function generateUserId(): string {
  return uuidv4()
}


export function copyToClipboard(text: string): Promise<void> {
  if(navigator.clipboard){
    return navigator.clipboard.writeText(text)
  }else
     {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}