'use client'

import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
}

export default function CodeEditor({ value, onChange, language, height = '900px' }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const getMonacoLanguage = (languageId: string) => {
    switch (languageId) {
      case 'javascript': return 'javascript'
      case 'python': return 'python'
      case 'java': return 'java'
      case 'cpp': return 'cpp'
      case 'c': return 'c'
      case 'typescript': return 'typescript'
      default: return 'javascript'
    }
  }

  return (
    <Editor
      height={height}
      defaultLanguage={getMonacoLanguage(language)}
      language={getMonacoLanguage(language)}
      value={value}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: false,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        parameterHints: {
          enabled: true,
        },
        hover: {
          enabled: true,
        },
      }}
    />
  )
}
