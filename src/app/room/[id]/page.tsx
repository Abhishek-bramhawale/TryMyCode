"use client"

import { useEffect, useState } from "react"

export default function RoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <h1>Room: {params.id}</h1>
    </div>
  )
}