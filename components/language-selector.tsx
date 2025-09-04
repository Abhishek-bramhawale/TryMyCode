"use client"

import { useStore } from "@/store/use-store"
import { PROGRAMMING_LANGUAGES } from "@/lib/constants"
import { emitLanguageChange } from "@/lib/socket"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"

export function LanguageSelector(){
  const { currentRoom, updateRoomLanguage } = useStore()

  const handleLanguageChange = (language: string) => {
    if(currentRoom){
      updateRoomLanguage(language)
      emitLanguageChange(currentRoom.id, language)
    }
  }

  if (!currentRoom) return null

  return(
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Language:</span>
      <Select value={currentRoom.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <SelectItem key={lang.id} value={lang.id}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 