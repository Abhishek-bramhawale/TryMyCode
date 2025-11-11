'use client'

import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/home')
  }

  return (
    <div>
      <h1>TryMyCode</h1>
      
      <h2>What is TryMyCode?</h2>
      <p>TryMyCode is a real-time collaborative code editing platform that allows multiple developers to write, edit, and execute code together in the same workspace.</p>
      
      <h2>What does it do?</h2>
      <p>TryMyCode enables teams to collaborate on code in real-time. Multiple users can join the same coding room and see each other's changes instantly as they type. You can write code in multiple programming languages, run and test it live, and see the output immediately.</p>
      
      <h2>Key Features</h2>
      <h3>Real-time Collaboration</h3>
      <p>Work together with your team members in the same code editor. See changes as they happen, with live synchronization of code across all connected users.</p>
      
      <h3>Live Code Execution</h3>
      <p>Run your code instantly with support for multiple programming languages. Get immediate feedback on your code execution results without leaving the editor.</p>
      
      <h3>User Presence</h3>
      <p>See who is currently online in your coding room and what they are working on. Know when your teammates are active and collaborating with you.</p>
      
      <h3>Create or Join Rooms</h3>
      <p>Create a new coding room to start a fresh collaboration session, or join an existing room using a room ID to collaborate with others.</p>
      
      <h2>How to Get Started</h2>
      <p>Click the button below to begin using TryMyCode. You can create a new coding room or join an existing one to start collaborating with your team.</p>
      
      <button onClick={handleGetStarted}>Get Started</button>
    </div>
  )
}
