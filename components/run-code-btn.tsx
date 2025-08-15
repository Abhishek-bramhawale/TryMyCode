'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'

interface RunCodeButtonProps {
  onRun?: () => Promise<void>
  disabled?: boolean
}

export default function RunCodeButton({ onRun, disabled = false }: RunCodeButtonProps) {
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = async () => {
    if (!onRun || isRunning) return
    
    setIsRunning(true)
    try {
      await onRun()
    } catch (error) {
      console.error('Code execution failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <button
      onClick={handleRun}
      disabled={disabled || isRunning}
      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isRunning ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      <span>{isRunning ? 'Running...' : 'Run Code'}</span>
    </button>
)}