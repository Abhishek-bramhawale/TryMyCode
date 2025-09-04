"use client"

import { useEffect, useRef, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { useStore } from "@/store/use-store"
import { DEFAULT_CODE_SAMPLES } from "@/lib/constants"
import { emitCodeChange, emitUserTyping } from "@/lib/socket"

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
  const emitDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const socketRef = useRef<any>(null)

  useEffect(() =>{
    if (currentRoom && editorRef.current) {
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

  const handleEditorChange = useCallback((value: string | undefined) =>{
    if (value !== undefined && currentRoom) {
      updateRoomCode(value)

      if (emitDebounceRef.current){
        clearTimeout(emitDebounceRef.current)
      }
      emitDebounceRef.current = setTimeout(() =>{
        emitCodeChange(currentRoom.id, value)
      }, 150)

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