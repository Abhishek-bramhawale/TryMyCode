"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/use-store"
import { USER_COLORS } from "@/lib/constants"
import { generateUserId } from "@/lib/utils"
import { ArrowLeft, Users, ArrowRight, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

export default function JoinPage(){
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const router = useRouter()
  const { user, setUser, setCurrentRoom, addUserToRoom } = useStore()

  useEffect(() =>{
    if (user) {
      setUsername(user.name)
      setShowUsernameInput(false) 
    } else {
      setShowUsernameInput(true) 
    }
  }, [user])

  const handleJoinRoom = async () =>{
    if (!roomId.trim()) {
      toast.error("Please enter a room ID")
      return
    }

    if (showUsernameInput && !username.trim()){
      toast.error("Please enter your name")
      return
    }

    setIsJoining(true)

    try{
      if(!user){
        const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
        const newUser = {
          id: generateUserId(),
          name: username.trim(),
          color: randomColor,
        }
        setUser(newUser)
      } else if (user.name !== username.trim()){
        const updatedUser = { ...user, name: username.trim()}
        setUser(updatedUser)
      }

      const normalizedRoomId = roomId.trim().toUpperCase()

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) 

      const response = await fetch(`/api/rooms?id=${normalizedRoomId}`,{
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok){
        if (response.status === 404) {
          toast.error("Room not found. Please check the room ID.")
        } else {
          toast.error("Failed to join room")
        }
        return
      }

      const { room } = await response.json()
      
      const currentUser = user ||{
        id: generateUserId(),
        name: username.trim(),
        color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
      }
      
      room.users = [...room.users, currentUser]
      setCurrentRoom(room)
      
      router.push(`/room/${normalizedRoomId}`)
    } catch (error) {
      console.error('Join room error:', error)
      if (error instanceof Error && error.name === 'AbortError'){
        toast.error("Request timed out. Please try again.")
      } else {
        toast.error("Failed to join room")
      }
    } finally {
      setIsJoining(false)
    }
  }

  const handleUsernameSubmit = () =>{
    if (!username.trim()) {
      toast.error("Please enter your name")
      return
    }
    
    const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
    const newUser = {
      id: generateUserId(),
      name: username.trim(),
      color: randomColor,
    }
    setUser(newUser)
    setShowUsernameInput(false)
  }

  return(
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Join a Room</h1>
              <p className="text-muted-foreground">
                Enter the room ID to join an existing collaboration session
              </p>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="space-y-4">
              {showUsernameInput ?(
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter"){
                        handleUsernameSubmit()
                      }
                    }}
                  />
                  <Button
                    onClick={handleUsernameSubmit}
                    className="w-full mt-2"
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm">{username}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowUsernameInput(true)}
                    className="w-full mt-2"
                  >
                    Change Name
                  </Button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Room ID
                </label>
                <Input
                  placeholder="Enter room ID (e.g., ABC123)"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="font-mono"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !showUsernameInput){
                      handleJoinRoom()
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleJoinRoom}
                disabled={isJoining || !roomId.trim() || showUsernameInput}
                className="w-full h-12 text-lg"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                    Joining...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5"/>
                    Join Room
                    <ArrowRight className="ml-2 h-5 w-5"/>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Don't have a room ID?{" "}
                <Link href="/" className="text-primary hover:underline">
                  Create a new room
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 