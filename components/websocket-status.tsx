'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store/use-store'
import { getSocket } from '@/lib/socket'

export function WebSocketStatus() {
  const { isConnected } = useStore()
  const [socketStatus, setSocketStatus] = useState<string>('Disconnected')

  useEffect(() => {
    const socket = getSocket()
    if (socket) {
      setSocketStatus(socket.connected ? 'Connected' : 'Disconnected')
      
      socket.on('connect', () => {
        setSocketStatus('Connected')
      })
      
      socket.on('disconnect', () => {
        setSocketStatus('Disconnected')
      })
    }
  }, [])

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>WebSocket: {socketStatus}</span>
    </div>
  )
}
