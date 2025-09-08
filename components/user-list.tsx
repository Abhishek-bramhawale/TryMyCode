"use client"

import { useStore } from "@/store/use-store"
import { User, Mic, MicOff, Volume2, VolumeX } from "lucide-react"

export function UserList(){
  const { currentRoom, user } = useStore()

  if (!currentRoom) return null

  return(
    <div className="p-4">
      <div className="space-y-3">
        {currentRoom.users.map((userItem) =>(
          <div
            key={userItem.id}
            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: userItem.color }}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{userItem.name}</span>
                {userItem.id === user?.id && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    You
                  </span>
                )}
                {userItem.isVoiceActive && (
                  <div className="flex items-center space-x-1">
                    {userItem.isMuted ? (
                      <MicOff className="h-3 w-3 text-red-500" />
                    ) : (
                      <Mic className="h-3 w-3 text-green-500" />
                    )}
                    {userItem.isDeafened ? (
                      <VolumeX className="h-3 w-3 text-red-500" />
                    ) : (
                      <Volume2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {userItem.isTyping ? "Typing..." : userItem.isVoiceActive ? "Voice Active" : "Online"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentRoom.users.length === 0 &&(
        <div className="text-center py-8 text-muted-foreground">
          <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No users online</p>
        </div>
      )}
    </div>
  )
} 