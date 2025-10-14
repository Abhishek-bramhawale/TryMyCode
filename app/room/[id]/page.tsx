"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/store/use-store"
import { PROGRAMMING_LANGUAGES, DEFAULT_CODE_SAMPLES } from "@/lib/constants"
import { copyToClipboard } from "@/lib/utils"
import {CodeEditor} from "@/components/CodeEditor"
import {UserList}  from "@/components/user-list"
import {LanguageSelector} from "@/components/language-selector"
import {RunCodeButton} from "@/components/run-code-btn"
import {InputOutputPanel}  from "@/components/ip-op-panel"
// import { VoiceControls } from "@/components/voice-controls"
import { Button } from "@/components/ui/button"
import { Copy, Users, Code, Play } from "lucide-react"
import toast from "react-hot-toast"
import { Header } from "@/components/header"

export default function RoomPage(){
  const params = useParams()
  const router = useRouter()
  const { user, currentRoom, setCurrentRoom, addUserToRoom, hasHydrated } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() =>{
    const initializeRoom = async () => {
      const roomId = params.id as string

      if (!hasHydrated) return
      if (!user) { router.push("/"); return }

      try{
        setIsLoading(true)
        const response = await fetch(`/api/rooms?id=${roomId}`)
        
        if(response.ok){
          const { room } = await response.json()
          
          const userInRoom = room.users.find((u: any) => u.id === user.id)
          
          if(!userInRoom){
            const addUserResponse = await fetch('/api/rooms', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                roomId: roomId,
                action: 'add-user',
                user: user
              })
            })
            
            if(addUserResponse.ok){
              const { room: updatedRoom } = await addUserResponse.json()
              setCurrentRoom(updatedRoom)
            }else{
              const roomWithUser = {
                ...room,
                users: [...room.users, user]
              }
              setCurrentRoom(roomWithUser)
            }
          }else{
            setCurrentRoom(room)
          }
        }else if (response.status === 404){
          const createResponse = await fetch('/api/rooms',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              userId: user.id,
              userName: user.name,
              userColor: user.color,
              roomIdOverride: roomId
            })
          })

          if(createResponse.ok){
            const { room } = await createResponse.json()
            setCurrentRoom(room)
          }else{
            setError('Failed to create room')
          }
        }else{
          setError('Failed to load room')
        }
      }catch(error){
        console.error('Room initialization error:', error)
        
        if(retryCount < 3){
          setRetryCount(prev => prev + 1)
          setTimeout(() => {
            initializeRoom()
          }, 1000 * (retryCount + 1)) 
          return
        }
        
        setError('Failed to initialize room')
      } finally {
        setIsLoading(false)
      }
    }

    initializeRoom()
  }, [user, params.id, router, setCurrentRoom, addUserToRoom, retryCount, hasHydrated])

  const handleCopyRoomLink = async () =>{
    const roomId = String(params.id)
    try{
      await copyToClipboard(roomId)
      toast.success("Room ID copied to clipboard!")
    }catch (error){
      toast.error("Failed to copy room ID")
    }
  }

  const handleRetry = () =>{
    setError(null)
    setRetryCount(0)
    setIsLoading(true)
  }

  if (isLoading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading room...</p>
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Retrying... ({retryCount}/3)
            </p>
          )}
        </div>
      </div>
    )
  }

  if (error){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Code className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={handleRetry} className="group hover:bg-gradient-to-r hover:from-primary hover:to-primary/80">
              <span className="group-hover:scale-105 transition-transform duration-200">Retry</span>
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="group hover:bg-gradient-to-r hover:from-accent hover:to-accent/80">
              <span className="group-hover:scale-105 transition-transform duration-200">Back to Home</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if(!user || !currentRoom){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex-1 flex flex-col">
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${currentRoom.users.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-muted-foreground">
                    Room: {params.id}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyRoomLink}
                  className="flex items-center space-x-2 group hover:bg-gradient-to-r hover:from-accent hover:to-accent/80"
                >
                  <Copy className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="group-hover:scale-105 transition-transform duration-200">Copy Link</span>
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <RunCodeButton />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <CodeEditor />
          </div>

          <div className="h-64 border-t">
            <InputOutputPanel />
          </div>
        </div>

        <div className="w-80 border-l bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Active Users ({currentRoom.users.length})
            </h3>
          </div>
          <UserList />
        </div>
      </div>
    </div>
  )
} 