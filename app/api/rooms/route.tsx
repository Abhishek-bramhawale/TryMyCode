import { NextRequest, NextResponse } from 'next/server'

const rooms = new Map()

export async function POST(request: NextRequest) { // new room creation
  try {
    const { userId, userName, userColor } = await request.json()

    if (!userId || !userName) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    const room = {
      id: roomId,
      users: [{ id: userId, name: userName, color: userColor }],
      code: '',
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

    const room = rooms.get(roomId.toUpperCase())

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

export async function PATCH(request: NextRequest) { //update ie add nd remove users
  try {
    const { roomId, action, user } = await request.json()

    if (!roomId || !action || !user) {
      return NextResponse.json(
        { error: 'Room ID, action, and user are required' },
        { status: 400 }
      )
    }

    const room = rooms.get(roomId.toUpperCase())

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