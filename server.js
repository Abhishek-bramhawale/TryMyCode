const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const rooms = new Map()
const userSockets = new Map()

const nextDir = path.join(__dirname, '.next')
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true })
}

app.prepare().then(() =>{
  const server = createServer((req, res) =>{
    handle(req, res)
  })

  const io = new Server(server,{
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) =>{
    console.log('User connected:', socket.id)

    socket.on('join-room', ({ roomId, user }) => {
      console.log(`User ${user.name} joining room ${roomId}`)
      
      socket.join(roomId)
      socket.roomId = roomId
      socket.userId = user.id
      
      userSockets.set(user.id, socket.id)
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          users: [],
          code: '',
          language: 'javascript',
          input: '',
          output: '',
          createdAt: new Date().toISOString()
        })
      }
      
      const room = rooms.get(roomId)
      
      if (!room.users.find(u => u.id === user.id)){
        room.users.push(user)
      }
      
      socket.to(roomId).emit('user-joined', { user })
      
      socket.emit('room-state', room)
      
      console.log(`Room ${roomId} users:`, room.users.map(u => u.name))
    })

    socket.on('code-change', ({ roomId, code }) =>{
      if (rooms.has(roomId)) {
        rooms.get(roomId).code = code
        socket.to(roomId).emit('code-update', { code })
      }
    })

    socket.on('language-change', ({ roomId, language }) =>{
  if (rooms.has(roomId)) {
    rooms.get(roomId).language = language
    socket.to(roomId).emit('language-update', { language })
  }
})


    socket.on('input-change', ({ roomId, input }) =>{
      if (rooms.has(roomId)) {
        rooms.get(roomId).input = input
        socket.to(roomId).emit('input-update', { input })
      }
    })

    socket.on('user-typing', ({ roomId, userId, isTyping }) =>{
      socket.to(roomId).emit('user-typing', { userId, isTyping })
    })


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
      
      if (socket.roomId && socket.userId) {
        const room = rooms.get(socket.roomId)
        if (room) {
          room.users = room.users.filter(u => u.id !== socket.userId)
          
          socket.to(socket.roomId).emit('user-left', { userId: socket.userId })
          
         
        }
        
        userSockets.delete(socket.userId)
      }
    })
  })

  const port = process.env.PORT || 3001
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
    console.log(`> WebSocket server running on port ${port}`)
  })

  server.on('error', (error) => {
    console.error('Server error:', error)
  })

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  })
}).catch((error) => {
  console.error('Failed to prepare Next.js app:', error)
  process.exit(1)
}) 