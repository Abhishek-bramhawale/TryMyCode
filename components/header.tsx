"use client"

import {Button } from "@/components/ui/button"
import {useStore } from "@/store/use-store"
import {Moon, Sun, Code, Users } from "lucide-react"
import {useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const { theme,setTheme } =useTheme()
  const{ user} = useStore()
  const router = useRouter()

  const toggleTheme = ()=>{
    setTheme(theme ==="light" ? "dark" : "light")
  }

  return(
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6" />
            <span className="font-bold text-xl">TryMyCode</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 group hover:bg-gradient-to-r hover:from-accent hover:to-accent/80 hover: transition-all duration-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-110" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:scale-110" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 group hover:bg-gradient-to-r hover:from-primary hover:to-primary/80"
            >
              <Code className="h-4 w-4 group-hover: transition-transform duration-200" />
              <span className="group-hover:scale-105 transition-transform duration-200">Create Room</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/join")}
              className="flex items-center space-x-2 group hover:bg-gradient-to-r hover:from-accent hover:to-accent/80"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="group-hover:scale-105 transition-transform duration-200">Join Room</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 