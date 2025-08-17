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
  updateRoomCode: (code: string) => void
  updateRoomLanguage: (language: string) => void
  updateRoomInput: (input: string) => void
  updateRoomOutput: (output: string) => void
  setRoomRunning: (isRunning: boolean) => void
  addUserToRoom: (user: User) => void
  removeUserFromRoom: (userId: string) => void
  updateUserTyping: (userId: string, isTyping: boolean) => void
  updateUserVoiceState: (userId: string, voiceState: Partial<User>) => void
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      currentRoom: null,
      setCurrentRoom: (room) => set({ currentRoom: room }),
      updateRoomCode: (code) => set((state) => ({
        currentRoom: state.currentRoom ? { ...state.currentRoom, code } : null
      })),
      updateRoomLanguage: (language) => set((state) => ({
        currentRoom: state.currentRoom ? { ...state.currentRoom, language } : null
      })),
      updateRoomInput: (input) => set((state) => ({
        currentRoom: state.currentRoom ? { ...state.currentRoom, input } : null
      })),
      updateRoomOutput: (output) => set((state) => ({
        currentRoom: state.currentRoom ? { ...state.currentRoom, output } : null
      })),
      setRoomRunning: (isRunning) => set((state) => ({
        currentRoom: state.currentRoom ? { ...state.currentRoom, isRunning } : null
      })),
      addUserToRoom: (user) => set((state) => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          users: [...state.currentRoom.users.filter(u => u.id !== user.id), user]
        } : null
      })),
      removeUserFromRoom: (userId) => set((state) => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          users: state.currentRoom.users.filter(u => u.id !== userId)
        } : null
      })),
      updateUserTyping: (userId, isTyping) => set((state) => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          users: state.currentRoom.users.map(u => 
            u.id === userId ? { ...u, isTyping } : u
          )
        } : null
      })),
      updateUserVoiceState: (userId, voiceState) => set((state) => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          users: state.currentRoom.users.map(u => 
            u.id === userId ? { ...u, ...voiceState } : u
          )
        } : null
      })),
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