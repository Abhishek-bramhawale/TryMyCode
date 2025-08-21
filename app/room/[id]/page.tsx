"use client"

import { useParams } from "next/navigation"

export default function RoomPage() {
  const params = useParams()

  return (
    <div className="p-4">
      <h1>Room: {params.id}</h1>
    </div>
  )
}
