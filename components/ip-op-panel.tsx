'use client'

import { useState } from 'react'

interface InputOutputPanelProps {
  input?: string
  output?: string
  onInputChange?: (input: string) => void
}

export default function InputOutputPanel({ input = '', output = '', onInputChange }: InputOutputPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4 h-48">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Input</h3>
        <textarea
          value={input}
          onChange={(e) => onInputChange?.(e.target.value)}
          className="w-full h-full resize-none bg-background border rounded p-2 text-sm"
          placeholder="Enter input here..."
        />
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Output</h3>
        <div className="w-full h-full bg-background border rounded p-2 text-sm overflow-auto">
          <pre className="whitespace-pre-wrap">{output || 'No output yet...'}</pre>
        </div>
      </div>
    </div>
  )
}