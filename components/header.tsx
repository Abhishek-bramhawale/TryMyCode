'use client'

import Link from 'next/link'
import { Home, Users, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold">Code Editor</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/join" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Join Room</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}