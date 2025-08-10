"use client"

import { useState, useEffect } from "react"

export default function JoinPage() {

    const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  
  return (
    <div className="p-4">
      <h1>Join Room</h1>
    </div>
  )
}