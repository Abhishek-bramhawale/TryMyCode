"use client"

import { useEffect, useRef, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { useStore } from "@/store/use-store"
import { DEFAULT_CODE_SAMPLES } from "@/lib/constants"
import { emitCodeChange, emitUserTyping, getSocket } from "@/lib/socket"

export function CodeEditor(){
  const{ 
    currentRoom, 
    user, 
    updateRoomCode, 
    updateRoomLanguage,
    updateUserTyping,
    isConnected,
    setIsConnected 
  } = useStore()
  const editorRef = useRef<any>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const emitDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const isUpdatingFromSocket = useRef(false)

  // Listen for WebSocket events
  useEffect(() => {
    const socket = getSocket()
    if (!socket) {
      console.log('No socket available in CodeEditor')
      return
    }

    console.log('Setting up WebSocket listeners in CodeEditor')

    const handleCodeUpdate = ({ code }: { code: string }) => {
      console.log('Received code update:', code.substring(0, 50) + '...')
      if (editorRef.current && !isUpdatingFromSocket.current) {
        const model = editorRef.current.getModel()
        if (model && model.getValue() !== code) {
          console.log('Updating editor with new code')
          isUpdatingFromSocket.current = true
          model.setValue(code)
          updateRoomCode(code)
          setTimeout(() => {
            isUpdatingFromSocket.current = false
          }, 100)
        }
      }
    }

    const handleLanguageUpdate = ({ language }: { language: string }) => {
      console.log('Received language update:', language)
      updateRoomLanguage(language)
    }

    const handleUserTyping = ({ userId, isTyping }: { userId: string, isTyping: boolean }) => {
      updateUserTyping(userId, isTyping)
    }

    socket.on('code-update', handleCodeUpdate)
    socket.on('language-update', handleLanguageUpdate)
    socket.on('user-typing', handleUserTyping)

    return () => {
      socket.off('code-update', handleCodeUpdate)
      socket.off('language-update', handleLanguageUpdate)
      socket.off('user-typing', handleUserTyping)
    }
  }, [updateRoomCode, updateRoomLanguage, updateUserTyping])

  useEffect(() =>{
    if (currentRoom && editorRef.current){
      const model = editorRef.current.getModel()
      if (model) {
        const currentValue = model.getValue()
        const sampleCode = DEFAULT_CODE_SAMPLES[currentRoom.language as keyof typeof DEFAULT_CODE_SAMPLES]
        
        if (currentValue === "" || currentValue === DEFAULT_CODE_SAMPLES.javascript) {
          model.setValue(sampleCode)
          updateRoomCode(sampleCode)
          emitCodeChange(currentRoom.id, sampleCode)
        }
      }
    }
  }, [currentRoom?.language, updateRoomCode])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    if (currentRoom) {
      const sampleCode = DEFAULT_CODE_SAMPLES[currentRoom.language as keyof typeof DEFAULT_CODE_SAMPLES]
      editor.setValue(currentRoom.code || sampleCode)
    }
  }

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined && currentRoom && !isUpdatingFromSocket.current) {
      console.log('Editor change detected:', value.substring(0, 50) + '...')
      updateRoomCode(value)

      // Debounce code changes to avoid too many WebSocket emissions
      if (emitDebounceRef.current) {
        clearTimeout(emitDebounceRef.current)
      }
      emitDebounceRef.current = setTimeout(() => {
        console.log('Emitting code change to WebSocket')
        emitCodeChange(currentRoom.id, value)
      }, 150)

      // Handle typing indicators
      if (user) {
        emitUserTyping(currentRoom.id, user.id, true)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
          emitUserTyping(currentRoom.id, user.id, false)
        }, 800)
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