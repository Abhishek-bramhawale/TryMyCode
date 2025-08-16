import { cn } from '@/lib/utils'

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Input({ value, onChange, placeholder, className }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
    />
  )
}