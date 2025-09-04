"use client"

import { useStore} from "@/store/use-store"
import { Textarea } from "./ui/textarea"
import {Input } from "./ui/input"
import { emitInputChange } from "@/lib/socket"

export function InputOutputPanel(){
  const {currentRoom, updateRoomInput,updateRoomOutput } =useStore()

  const handleInputChange =(value: string) =>{
    if (currentRoom) {
      updateRoomInput(value)
      emitInputChange(currentRoom.id, value)
    }
  }

  if(!currentRoom)return null

  return(
    <div className="h-full flex">
      <div className="flex-1 border-r">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Input (stdin)</h3>
        </div>
        <div className="p-4">
          <Textarea
            placeholder="Enter input for your program..."
            value={currentRoom.input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-full resize-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Output (stdout)</h3>
        </div>
        <div className="p-4">
          <Textarea
            placeholder="Output will appear here..."
            value={currentRoom.output}
            onChange={(e) => updateRoomOutput(e.target.value)}
            className="h-full resize-none font-mono text-sm bg-muted"
            readOnly
          />
        </div>
      </div>
    </div>
  )
} 