'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Code, Users, Zap, Globe, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-primary/10 rounded-full animate-pulse">
              <Code className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            TryMyCode
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Realtime collaborative code editing platform
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Write, edit, and execute code together with your team in the same workspace. See changes as they happen, run code instantly, and collaborate seamlessly.
          </p>
          
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="text-lg px-8 py-4 h-auto group bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-card border rounded-lg p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">What is TryMyCode?</h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              TryMyCode is a realtime collaborative code editing platform that allows multiple developers to write, edit, and execute code together in the same workspace. Built for teams who want to code together, share ideas instantly, and test their code in realtime.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border rounded-lg p-6 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.5)] transition-shadow duration-300 hover:scale-105 transform">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-3 text-center">Realtime Collaboration</h3>
              <p className="text-sm text-muted-foreground text-center">
                Work together with your team members in the same code editor. See changes as they happen, with live synchronization of code across all connected users.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 hover:shadow-[0_0_0_3px_rgba(16,185,129,0.5)] transition-shadow duration-300 hover:scale-105 transform">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-3 text-center">Live Code Execution</h3>
              <p className="text-sm text-muted-foreground text-center">
                Run your code instantly with support for multiple programming languages. Get immediate feedback on your code execution results without leaving the editor.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 hover:shadow-[0_0_0_3px_rgba(168,85,247,0.5)] transition-shadow duration-300 hover:scale-105 transform">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Globe className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-3 text-center">User Presence</h3>
              <p className="text-sm text-muted-foreground text-center">
                See who is currently online in your coding room and what they are working on. Know when your teammates are active and collaborating with you.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 hover:shadow-[0_0_0_3px_rgba(251,146,60,0.5)] transition-shadow duration-300 hover:scale-105 transform">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <Code className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-3 text-center">Create or Join Rooms</h3>
              <p className="text-sm text-muted-foreground text-center">
                Create a new coding room to start a fresh collaboration session, or join an existing room using a room ID to collaborate with others.
              </p>
            </div>
          </div>
        </div>

        {/* <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-card border rounded-lg p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">How to Get Started</h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed mb-8">
              Getting started with TryMyCode is simple. Click the button below to begin your collaborative coding journey. You can create a new coding room or join an existing one to start collaborating with your team instantly.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="text-lg px-8 py-6 h-auto group hover:bg-gradient-to-r hover:from-primary hover:to-primary/80 hover:shadow-lg hover:shadow-primary/25"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
