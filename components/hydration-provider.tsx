'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/use-store'

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const { setHydrated } = useStore()

  useEffect(() => {
    setHydrated()
  }, [setHydrated])

  return <>{children}</>
}
