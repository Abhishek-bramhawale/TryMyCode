"use client"

import { useEffect, useRef, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { useStore } from "@/store/use-store"
import { DEFAULT_CODE_SAMPLES } from "@/lib/constants"
import { emitCodeChange, emitUserTyping,initializeSocket } from "@/lib/socket"

export function CodeEditor(){
  const{ 
    currentRoom, 
    user, 
    updateRoomCode, 
    updateRoomLanguage,
    updateUserTyping,
    addUserToRoom,
    removeUserFromRoom,
    setCurrentRoom,
    isConnected,
    setIsConnected 
  } = useStore()
  const editorRef = useRef<any>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const emitDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const socketRef = useRef<any>(null)
  const isUserTypingRef = useRef<boolean>(false)
  const lastUserInputRef = useRef<string>('')
  const lastSyncTimeRef = useRef<number>(0)

   useEffect(() =>{
    if (currentRoom && user){
      const socket = initializeSocket()
      socketRef.current = socket
      
      socket.on('connect', () =>{
        setIsConnected(true)
        socket.emit('join-room', { roomId: currentRoom.id, user })
      })

      socket.on('disconnect', () =>{
        setIsConnected(false)
      })

      socket.on('code-update', ({ code }) =>{
        if (editorRef.current && !isUserTypingRef.current){
          const model = editorRef.current.getModel()
          if (model && model.getValue() !== code){
            const currentValue = model.getValue()
            const now = Date.now()
            
            const timeSinceLastInput = now - lastSyncTimeRef.current
            
            const isSignificantChange = 
              Math.abs(currentValue.length - code.length) > 5 || 
              currentValue.length < 10 || 
              timeSinceLastInput > 2000 || 
              !currentValue.includes(code.substring(0, Math.min(20, Math.min(currentValue.length, code.length))))
            
            if (isSignificantChange) {
              model.setValue(code)
              updateRoomCode(code)
              lastSyncTimeRef.current = now
            }
          }
        }
      })

      socket.on('language-update', ({ language }) =>{
        updateRoomLanguage(language)
      })

      socket.on('user-joined',({ user: newUser }) =>{
        console.log('User joined:', newUser)
        addUserToRoom(newUser)
      })

      socket.on('user-left', ({ userId }) =>{
        console.log('User left:', userId)
        removeUserFromRoom(userId)
      })

      socket.on('user-typing', ({ userId, isTyping })=>{
        updateUserTyping(userId, isTyping)
      })


      socket.on('room-state', (roomState) =>{
        if (roomState.code) {
          updateRoomCode(roomState.code)
        }
        if (roomState.language){
          updateRoomLanguage(roomState.language)
        }
        setCurrentRoom(roomState)
      })

      socket.connect()

      return () => {
        if (socket) {
          socket.disconnect()
        }
        isUserTypingRef.current = false
      }
    }
  }, [currentRoom?.id, user, setIsConnected, updateRoomCode, updateRoomLanguage, updateUserTyping])

  useEffect(() =>{
    if (currentRoom && editorRef.current){
      const model = editorRef.current.getModel()
      if (model) {
        const currentValue = model.getValue()
        const sampleCode = DEFAULT_CODE_SAMPLES[currentRoom.language as keyof typeof DEFAULT_CODE_SAMPLES]
        
        if (currentValue === "" || currentValue === DEFAULT_CODE_SAMPLES.javascript) {
          const position = editorRef.current.getPosition()
          model.setValue(sampleCode)
          updateRoomCode(sampleCode)
          emitCodeChange(currentRoom.id, sampleCode)
          if (position) {
            editorRef.current.setPosition(position)
          }
        }
      }
    }
  }, [currentRoom?.language, updateRoomCode])

  useEffect(() => {
    if (!currentRoom && socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [currentRoom, setIsConnected])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    if (currentRoom) {
      const sampleCode = DEFAULT_CODE_SAMPLES[currentRoom.language as keyof typeof DEFAULT_CODE_SAMPLES]
      editor.setValue(currentRoom.code || sampleCode)
    }
  }

  const handleEditorChange = useCallback((value: string | undefined) =>{
    if (value !== undefined && currentRoom) {
      isUserTypingRef.current = true
      lastUserInputRef.current = value
      lastSyncTimeRef.current = Date.now()
      
      updateRoomCode(value)

      if (emitDebounceRef.current){
        clearTimeout(emitDebounceRef.current)
      }
      emitDebounceRef.current = setTimeout(() =>{
        emitCodeChange(currentRoom.id, value)
        setTimeout(() => {
          isUserTypingRef.current = false
        }, 200)
      }, 500)  

    if (user) {
        emitUserTyping(currentRoom.id, user.id, true)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
          emitUserTyping(currentRoom.id, user.id, false)
        }, 1000) 
      }
    }
  }, [currentRoom, user, updateRoomCode])

  if (!currentRoom) return null

  return(
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        language={currentRoom.language}
        theme="vs-dark"
        value={currentRoom.code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          wordWrap: "on",
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          wordBasedSuggestions: "allDocuments",
        }}
      />
    </div>
  )
} 