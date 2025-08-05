'use client'

import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('54') // 54 = C++
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    })
    const data = await res.json()
    setOutput(data.output || 'No output')
    setLoading(false)
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Judge0 Code Runner</h1>

      <select
        className="border p-2 mb-4"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="54">C++</option>
        <option value="62">Java</option>
        <option value="71">Python</option>
        <option value="63">JavaScript</option>
      </select>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        className="w-full h-64 border p-4 mb-4 font-mono"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>

      {output && (
        <pre className="mt-6 bg-gray-900 text-white p-4 rounded">
          {output}
        </pre>
      )}
    </main>
  )
}
