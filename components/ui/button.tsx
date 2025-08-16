import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function Button({ children, onClick, className, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  )
}