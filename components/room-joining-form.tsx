'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RoomJoiningForm() {
  const [userName, setUserName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !roomId.trim()) return

    setIsJoining(true)
    try {
      const response = await fetch(`/api/rooms?id=${roomId.toUpperCase()}`)
      
      if (response.ok) {
        router.push(`/room/${roomId.toUpperCase()}?user=${encodeURIComponent(userName.trim())}`)
      } else {
        alert('Room not found!')
      }
    } catch (error) {
      console.error('Failed to join room:', error)
      alert('Failed to join room')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <form onSubmit={handleJoinRoom} className="space-y-4">
      <div>
        <label htmlFor="userName" className="block text-sm font-medium mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="Enter your name"
          required
        />
      </div>
      <div>
        <label htmlFor="roomId" className="block text-sm font-medium mb-2">
          Room ID
        </label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="Enter room ID"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isJoining || !userName.trim() || !roomId.trim()}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isJoining ? 'Joining...' : 'Join Room'}
      </button>
    </form>
  )
}