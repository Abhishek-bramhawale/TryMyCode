"use client"

import { useState} from "react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/use-store"
import { Play, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export function RunCodeButton(){
  const { currentRoom, updateRoomOutput, setRoomRunning } = useStore()
  const [isRunning, setIsRunning] = useState(false)

  const handleRunCode = async() =>{
    if (!currentRoom) return

    setIsRunning(true)
    setRoomRunning(true)

    try {
      const response = await fetch('/api/execute',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCode: currentRoom.code,
          language: currentRoom.language,
          stdin: currentRoom.input
        })
      })

      if (!response.ok){
        throw new Error('Failed to execute code')
      }

      const result = await response.json()

      if (result.error){
        updateRoomOutput(`Error: ${result.error}`)
        toast.error("Code execution failed")
      } else {
        updateRoomOutput(result.output)
        toast.success("Code executed successfully!")
      }
    } catch (error){
      console.error('Code execution error:', error)
      updateRoomOutput("Error: Failed to execute code. Please check your code and try again.")
      toast.error("Failed to execute code")
    } finally {
      setIsRunning(false)
      setRoomRunning(false)
    }
  }

  return(
    <Button
      onClick={handleRunCode}
      disabled={isRunning || !currentRoom?.code}
      className="flex items-center space-x-2 group hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 hover:shadow-lg hover:shadow-green-500/25"
    >
      {isRunning ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      )}
      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{isRunning ? "Running..." : "Run Code"}</span>
    </Button>
  )
} 