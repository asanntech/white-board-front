import { atom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import { yDrawings, YJS_ORIGIN } from './yjsAtom'
import { Drawing } from '../types'

type ServerToClientEvents = {
  drawing: (data: Drawing) => void
  drawingEnd: (data: Drawing) => void
  transform: (data: Drawing[]) => void
  remove: (data: Drawing[]) => void
  roomData: (data: Drawing[]) => void
  userEntered: (userId: string) => void
}

export type ClientToServerEvents = {
  join: (params: { roomId: string }) => void
  drawing: (params: { roomId: string; drawings: Drawing[] }) => void
  drawingEnd: (params: { roomId: string; drawing: Drawing }) => void
  transform: (params: { roomId: string; drawings: Drawing[] }) => void
  remove: (params: { roomId: string; drawings: Drawing[] }) => void
}

export const socketAtom = atom<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
export const socketConnectionAtom = atom<boolean>(false)
export const socketErrorAtom = atom<string | null>(null)
export const roomIdAtom = atom<string | null>(null)

export const initializeSocketAtom = atom(null, (get, set, roomId: string, token: string) => {
  const currentSocket = get(socketAtom)

  if (currentSocket) {
    currentSocket.disconnect()
  }

  const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.NEXT_PUBLIC_WS_WHITE_BOARD, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    auth: { token },
  })

  newSocket.on('connect', () => {
    set(socketConnectionAtom, true)
    set(socketErrorAtom, null)
    set(roomIdAtom, roomId)
    newSocket.emit('join', { roomId })
  })

  newSocket.on('disconnect', () => {
    set(socketConnectionAtom, false)
  })

  newSocket.io.on('reconnect_failed', () => {
    set(socketConnectionAtom, false)
    set(socketErrorAtom, 'Connection failed')
  })

  // リモートからの受信 → ローカルYjsに反映（REMOTEタグで無限ループ防止）
  newSocket.on('drawing', (data: Drawing) => {
    yDrawings.doc?.transact(() => {
      yDrawings.set(data.id, data)
    }, YJS_ORIGIN.REMOTE)
  })

  newSocket.on('drawingEnd', (data: Drawing) => {
    yDrawings.doc?.transact(() => {
      yDrawings.set(data.id, data)
    }, YJS_ORIGIN.REMOTE)
  })

  newSocket.on('transform', (data: Drawing[]) => {
    yDrawings.doc?.transact(() => {
      data.forEach((drawing) => {
        yDrawings.set(drawing.id, drawing)
      })
    }, YJS_ORIGIN.REMOTE)
  })

  newSocket.on('remove', (data: Drawing[]) => {
    yDrawings.doc?.transact(() => {
      data.forEach((drawing) => {
        yDrawings.delete(drawing.id)
      })
    }, YJS_ORIGIN.REMOTE)
  })

  newSocket.on('roomData', (data: Drawing[]) => {
    yDrawings.doc?.transact(() => {
      data.forEach((drawing) => {
        yDrawings.set(drawing.id, drawing)
      })
    }, YJS_ORIGIN.REMOTE)
  })

  newSocket.on('userEntered', (userId: string) => {
    console.log(`user ${userId} entered the room`)
  })

  set(socketAtom, newSocket)
})

export const disconnectSocketAtom = atom(null, (get, set) => {
  const socket = get(socketAtom)
  if (socket) {
    socket.disconnect()
    set(socketAtom, null)
    set(socketConnectionAtom, false)
    set(socketErrorAtom, null)
  }
})
