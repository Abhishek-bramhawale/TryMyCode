'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RoomCreationForm() {
  const [userName, setUserName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: crypto.randomUUID(),
          userName: userName.trim(),
          userColor: `#${Math.floor(Math.random()*16777215).toString(16)}`
        })
      })

      if (response.ok) {
        const { room } = await response.json()
        router.push(`/room/${room.id}`)
      }
    } catch (error) {
      console.error('Failed to create room:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <form onSubmit={handleCreateRoom} className="space-y-4">
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
      <button
        type="submit"
        disabled={isCreating || !userName.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isCreating ? 'Creating...' : 'Create Room'}
      </button>
    </form>
  )
}