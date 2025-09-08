import { Loader2 } from 'lucide-react'

interface LoadingProps{
  text?: string
  size?: 'sm' | 'md'| 'lg'
}

export default function Loading({ text = 'Loading...', size = 'md' }: LoadingProps){
  const sizeClasses ={
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return(
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin mb-2`} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}