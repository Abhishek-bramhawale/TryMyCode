import { NextRequest, NextResponse } from 'next/server'
import { generateRoomId } from '@/lib/utils'
import { DEFAULT_CODE_SAMPLES } from '@/lib/constants'

const rooms = new Map()

export async function POST(request: NextRequest) { // new room creation
  try {
    const { userId, userName, userColor, roomIdOverride } = await request.json()

    if (!userId || !userName) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

   const roomId = (roomIdOverride || generateRoomId()).toUpperCase()

    const room = {
      id: roomId,
      users: [{ id: userId, name: userName, color: userColor }],
      code: DEFAULT_CODE_SAMPLES.javascript,
      language: 'javascript',
      input: '',
      output: '',
      isRunning: false,
      createdAt: new Date().toISOString()
    }

    rooms.set(roomId, room)

    return NextResponse.json({ room })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) { //get existing room details
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('id')

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    const normalizedRoomId = roomId.toUpperCase()

    let room = null
    const roomEntries = Array.from(rooms.entries())
    for (const [id, roomData] of roomEntries) {
      if (id.toUpperCase() === normalizedRoomId){
        room = roomData
        break
      }
    }

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ room })
  } catch (error) {
    console.error('Get room error:', error)
    return NextResponse.json(
      { error: 'Failed to get room' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest){ //update
   try {
     const { roomId, ...updates } = await req.json()

     if(!roomId){
       return NextResponse.json({error:"Room ID is required"}, {status:400})
     }

     const normId = roomId.toUpperCase()
     
     let foundRoom=null
     let foundKey=null
     const entries = Array.from(rooms.entries())
     for(const [rid, rdata] of entries){
        if(rid.toUpperCase()===normId){
            foundRoom=rdata
            foundKey=rid
            break
        }
     }

     if(!foundRoom){
       return NextResponse.json({error:"Room not found"}, {status:404})
     }

     Object.assign(foundRoom, updates)
     rooms.set(foundKey, foundRoom)

     return NextResponse.json({room:foundRoom})
   } catch(err){
     console.error("err updating room", err)
     return NextResponse.json({error:"Failed to update room"}, {status:500})
   }
}


export async function PATCH(request: NextRequest) { //update ie add nd remove users
  try {
    const { roomId, action, user } = await request.json()

    if (!roomId || !action || !user) {
      return NextResponse.json(
        { error: 'Room ID, action, and user are required' },
        { status: 400 }
      )
    }


   const normalizedRoomId = roomId.toUpperCase()
   let room = null
     const roomEntries = Array.from(rooms.entries())
for (const [id, roomData] of roomEntries) {
  if (id.toUpperCase() === normalizedRoomId) {
    room = roomData
    break
  }
}

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    if (action === 'add-user') {
      if (!room.users.find((u: any) => u.id === user.id)) {
        room.users.push(user)
      }
    } else if (action === 'remove-user') {
      room.users = room.users.filter((u: any) => u.id !== user.id)
    }

    rooms.set(roomId.toUpperCase(), room)
    return NextResponse.json({ room })
  } catch (error) {
    console.error('Update room users error:', error)
    return NextResponse.json(
      { error: 'Failed to update room users' },
      { status: 500 }
    )
  }
}