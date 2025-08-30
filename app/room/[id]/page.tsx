"use client"


import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/store/use-store"
import { PROGRAMMING_LANGUAGES, DEFAULT_CODE_SAMPLES } from "@/lib/constants"
import { copyToClipboard } from "@/lib/utils"
import CodeEditor from "@/components/CodeEditor"
import UserList  from "@/components/user-list"
import LanguageSelector from "@/components/language-selector"
import RunCodeButton from "@/components/run-code-btn"
import InputOutputPanel  from "@/components/ip-op-panel"
// import { VoiceControls } from "@/components/voice-controls"
import { Button } from "@/components/ui/button"
import { Copy, Users, Code, Play } from "lucide-react"
import toast from "react-hot-toast"

export default function RoomPage(){
  const params=useParams()
  const router=useRouter()
  const {user,currentRoom,setCurrentRoom,hasHydrated,updateRoomCode,updateRoomLanguage}=useStore()
  const [loading,setLoading]=useState(false)
const [error, setError] = useState<string | null>(null)
  const [retry,setRetry]=useState(0)

  useEffect(()=>{
    async function initRoom(){
      const roomId=params.id
      if(!hasHydrated) return
      if(!user){router.push("/");return}

      try{
        setLoading(true)
        const res=await fetch(`/api/rooms?id=${roomId}`)
        if(res.ok){
          const {room}=await res.json()
          const uInRoom=room.users.find(user.id)
          if(!uInRoom){
            const patch=await fetch("/api/rooms",{
              method:"PATCH",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({roomId,action:"add-user",user})
            })
            if(patch.ok){
              const {room:updated}=await patch.json()
              setCurrentRoom(updated)
            }else setCurrentRoom({...room,users:[...room.users,user]})
          }else setCurrentRoom(room)
        }else if(res.status===404){
          const create=await fetch("/api/rooms",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
              userId:user.id,
              userName:user.name,
              userColor:user.color,
              roomIdOverride:roomId
            })
          })
          if(create.ok){
            const {room}=await create.json()
            setCurrentRoom(room)
          }else setError("Couldn't create room")
        }else setError("Couldn't load room")
      }catch(e){
        console.log("room err",e)
        if(retry<3){
          setRetry(prev=>prev+1)
          setTimeout(()=>initRoom(),1000*(retry+1))
          return
        }
        setError("Something went wrong")
      }finally{
        setLoading(false)
      }
    }
    initRoom()
  },[user,params.id,router,setCurrentRoom,hasHydrated,retry])

  useEffect(() => {
    if(currentRoom && (!currentRoom.code || currentRoom.code.trim() === '')) {
      const defaultLanguage = currentRoom.language || 'javascript'
      const defaultCode =DEFAULT_CODE_SAMPLES[defaultLanguage as keyof typeof DEFAULT_CODE_SAMPLES] || DEFAULT_CODE_SAMPLES.javascript
      updateRoomCode(defaultCode)
    }
  },[currentRoom, updateRoomCode])

  const handleCopy=async()=>{
    try{
      await copyToClipboard(String(params.id))
      toast.success("Room ID copied")
    }catch{
      toast.error("Copy failed")
    }
  }

  if(loading){
    return <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
        <p>Loading room...</p>
        {retry>0 && <p className="text-sm text-muted mt-2">Retry {retry}/3</p>}
      </div>
    </div>
  }

  if(error){
    return <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="text-red-500 mb-4"><Code className="h-12 w-12 mx-auto"/></div>
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted mb-4">{error}</p>
        <div className="space-x-2">
          <Button onClick={()=>{setRetry(0);setError(null);setLoading(true)}}>Retry</Button>
          <Button variant="outline" onClick={()=>router.push("/")}>Home</Button>
        </div>
      </div>
    </div>
  }

    if(!user || !currentRoom) return <div className="min-h-screen flex justify-center items-center">
    <div className="text-center">
      <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex h-full">
        <div className="flex-1 flex flex-col">
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${currentRoom.users.length>0?"bg-green-500":"bg-red-500"}`}/>
                  <span className="text-sm text-muted">Room: {params.id}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center space-x-2">
                  <Copy className="h-4 w-4"/> <span>Copy Link</span>
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                {/* <VoiceControls/> */}
                <LanguageSelector/>
                <RunCodeButton/>
              </div>
            </div>
          </div>

            <div className="flex-1">
            <CodeEditor value={currentRoom.code || ''} 
              onChange={updateRoomCode} 
              language={currentRoom.language || 'javascript'} 
            />
          </div>

          <div className="h-64 border-t"><InputOutputPanel/></div>
        </div>

        <div className="w-80 border-l bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center">
              <Users className="mr-2 h-4 w-4"/> Active Users ({currentRoom.users.length})
            </h3>
          </div>
          <UserList users={currentRoom.users}/>
        </div>
      </div>
    </div>
  )
}

