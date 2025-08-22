"use client"

import {useEffect,useState} from "react"
import {useParams,useRouter} from "next/navigation"
import {useStore} from "@/store/use-store"
import {copyToClipboard} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Code,Users} from "lucide-react"
import toast from "react-hot-toast"

export default function RoomPage(){
  const params=useParams()
  const router=useRouter()
  const {user,currentRoom,setCurrentRoom,hasHydrated}=useStore()
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
          const uInRoom=room.users.find(u=>u.id===user.id)
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
}