import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  color: string
  isTyping?: boolean
  isVoiceActive?: boolean
  isMuted?: boolean
  isDeafened?: boolean
}

export interface Room {
  id: string
  name?: string
  users: User[]
  code: string
  language: string
  input: string
  output: string
  isRunning: boolean
  createdAt?: string
}

interface AppState {
  user: User | null
  setUser: (user: User) => void
  currentRoom: Room | null
  setCurrentRoom: (room: Room | null) => void
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      currentRoom: null,
      setCurrentRoom: (room) => set({ currentRoom: room }),
      isConnected: false,
      setIsConnected: (isConnected) => set({ isConnected }),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'code-editor-storage',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
      }),
    }
  )
)