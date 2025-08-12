'use client'

import { useState } from 'react'
// import CodeEditor from '@/components/CodeEditor'
// import Editor from '@/components/CodeEditor'
// import InputOutputPanel from '@/components/ip-op-panel'
// import RoomCreationForm from '@/components/room-creation-form'
import RoomJoiningForm from '@/components/room-joining-form'


export default function Home() {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`)
  const [language, setLanguage] = useState('54') 
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

  const getLanguageName = (languageId: string) => {
    switch (languageId) {
      case '54': return 'C++'
      case '62': return 'Java'
      case '71': return 'Python'
      case '63': return 'JavaScript'
      default: return 'Unknown'
    }
  }

  // return (
  //   <main className="min-h-screen bg-gray-900 text-white">
  //     <div className="container mx-auto p-6">
  //       <h1 className="text-3xl font-bold mb-6 text-center">Judge0 Code Runner</h1>
        
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //         <div className="space-y-4">
  //           <div className="flex items-center justify-between">
  //             <h2 className="text-xl font-semibold">Code Editor</h2>
  //             <select
  //               className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               value={language}
  //               onChange={(e) => setLanguage(e.target.value)}
  //             >
  //               <option value="54">C++</option>
  //               <option value="62">Java</option>
  //               <option value="71">Python</option>
  //               <option value="63">JavaScript</option>
  //             </select>
  //           </div>
            
  //           <div className="border border-gray-600 rounded-lg overflow-hidden">
  //             <CodeEditor
  //               value={code}
  //               onChange={setCode}
  //               language={language}
  //               height="500px"
  //             />
  //           </div>
            
  //           <button
  //             className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  //             onClick={handleSubmit}
  //             disabled={loading}
  //           >
  //             {loading ? 'Running...' : `Run ${getLanguageName(language)} Code`}
  //           </button>
  //         </div>

  //         <div className="space-y-4">
  //           <h2 className="text-xl font-semibold">Output</h2>
  //           <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 min-h-[500px]">
  //             {output ? (
  //               <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto max-h-full">
  //                 {output}
  //               </pre>
  //             ) : (
  //               <div className="text-gray-400 text-center mt-20">
  //                 Run your code to see the output here
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </main>
  // )

  return(
    <div>
      <div className="p-4">
      {/* <Editor
        value={code}
        onChange={setCode}
        language="71" // Python
        height="500px"
      /> */}
      {/* <InputOutputPanel/> */}
      {/* <RoomCreationForm/> */}
      <RoomJoiningForm/>

    </div>
    </div>
  )
}
