'use client'

import { User } from 'lucide-react'

interface User {
  id: string
  name: string
  color?: string
}

interface UserListProps {
  users: User[]
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">Connected Users ({users.length})</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color || '#3b82f6' }}
            />
            <User className="h-4 w-4" />
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}