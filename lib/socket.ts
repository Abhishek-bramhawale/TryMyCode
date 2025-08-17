import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function initializeSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      autoConnect: false,
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
  }

  return socket
}

export function getSocket(): Socket | null {
  return socket
}