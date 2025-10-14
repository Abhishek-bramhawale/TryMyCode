'use client'

import { useState , useEffect} from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/use-store"
import { generateUserId, copyToClipboard } from "@/lib/utils"
import { USER_COLORS } from "@/lib/constants"
import { Code, Users, Copy, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import {Header} from "@/components/header"


export default function Home() {
  const [username, setUsername] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { user, setUser, setCurrentRoom } = useStore();

    useEffect(()=>{
    if (user){
      setUsername(user.name)
    }
  }, [user])

  const handleCreateRoom =async() =>{
    if (!username.trim()) {
      toast.error("Please enter your name")
      return
    }

    setIsCreating(true)



 try {
      if (!user) {
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
const response = await fetch('/api/rooms',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: user?.id || generateUserId(),
          userName: username.trim(),
          userColor: user?.color ||USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
        })

      
      })
        const { room } = await response.json()
      setCurrentRoom(room)

      router.push(`/room/${room.id}`)
}catch (error){
      console.error('Create room error:', error)
      toast.error("Failed to create room")
    } finally{
      setIsCreating(false)
    }
  }

  const handleJoinRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter your name")
      return
    }

    if (!user) {
      const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
      const newUser = {
        id: generateUserId(),
        name: username.trim(),
        color: randomColor,
      }
      setUser(newUser)
    } else if (user.name !== username.trim()) {
      // Update user name if changed
      const updatedUser = { ...user, name: username.trim() }
      setUser(updatedUser)
    }

    router.push("/join")
  }


return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Code className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to{" "}
              <span className="text-primary">TryMyCode</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Realtime collaborative code editing with live compilation and interpretation
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
            
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateRoom()
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="flex-1 h-12 text-lg group hover:bg-gradient-to-r hover:from-primary hover:to-primary/80"
              >
                <Code className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                Create New Room
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 h-12 text-lg group hover:bg-gradient-to-r hover:from-accent hover:to-accent/80"
                onClick={handleJoinRoom}
              >
                <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                Join Existing Room
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Code className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Real time Editing</h3>
              <p className="text-sm text-muted-foreground">
                Collaborate with others in realtime with live code synchronization
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Code className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Live Compilation</h3>
              <p className="text-sm text-muted-foreground">
                Run your code instantly with support for multiple programming languages
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">User Presence</h3>
              <p className="text-sm text-muted-foreground">
                See who's online and what they're working on in realtime libe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 