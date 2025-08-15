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
      case '54': return 'cpp'
      case '62': return 'java'
      case '71': return 'python'
      case '63': return 'javascript'
      default: return 'plaintext'
    }
  }

  const getSampleCode = (languageId: string) => {
    switch (languageId) {
      case '54': // C++
        return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
      case '62': // Java
        return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
      case '71': // Python
        return `print("Hello, World!")`
      case '63': 
        return `console.log("Hello, World!");`
      default:
        return ''
    }
  }

  useEffect(() => {
    if (value === '' && editorRef.current) {
      const sampleCode = getSampleCode(language)
      if (sampleCode) {
        onChange(sampleCode)
      }
    }
  }, [language, value, onChange])

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
