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


 export  function connectToRoom ( roomId:string , user : {id:string; name:string , color:string} ) {
   const socket=   getSocket()
   if(socket){
     socket.connect( )
       socket.emit('join-room' ,{roomId ,user} )
   } 
}


export   function disconnectFromRoom( ){
 const socket =getSocket()
 if ( socket){
   socket. disconnect()
 } 
}


 export function emitCodeChange(roomId:string ,code:string){
   const socket= getSocket( ) 
   if(socket &&socket.connected ){
   socket.emit('code-change' , {roomId,  code,})
   }
 }


 export  function emitLanguageChange(roomId:string,language:string  ){
 const socket=getSocket()
   if(socket && socket.connected){
 socket.emit( 'language-change' ,{ roomId:roomId,language  } )
  } 
}



 export   function emitInputChange( roomId:string , input :string ){
   const socket = getSocket()
   if(socket&&socket.connected){
 socket.emit('input-change',{ roomId ,input})
   }
}


 export function  emitUserTyping( roomId:string , userId:string , isTyping:boolean){
  const socket= getSocket( )
   if( socket && socket.connected  ) {
     socket.emit('user-typing' , {roomId,userId ,isTyping } )
   } 
 }
