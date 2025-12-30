import { atom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import * as Y from 'yjs'
import { yDoc } from './yjsAtom'

type ServerToClientEvents = {
  'yjs:update': (data: { update: number[] }) => void
  'yjs:sync': (data: { state: number[] }) => void
  userEntered: (userId: string) => void
}

export type ClientToServerEvents = {
  'yjs:update': (params: { roomId: string; update: number[] }) => void
  'yjs:sync:request': (params: { roomId: string }) => void
}

type YjsOrigin = 'local' | 'remote'

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

  const handleUpdate = (update: Uint8Array, origin: YjsOrigin) => {
    if (origin === 'local') {
      newSocket.emit('yjs:update', {
        roomId,
        update: Array.from(update),
      })
    }
  }

  yDoc.on('update', handleUpdate)

  newSocket.on('connect', () => {
    set(socketConnectionAtom, true)
    set(socketErrorAtom, null)
    set(roomIdAtom, roomId)
    newSocket.emit('yjs:sync:request', { roomId })
  })

  newSocket.on('disconnect', () => {
    set(socketConnectionAtom, false)
    yDoc.off('update', handleUpdate)
  })

  newSocket.io.on('reconnect_failed', () => {
    set(socketConnectionAtom, false)
    set(socketErrorAtom, 'Connection failed')
  })

  newSocket.on('yjs:update', (data: { update: number[] }) => {
    const update = new Uint8Array(data.update)
    Y.applyUpdate(yDoc, update, 'remote')
  })

  newSocket.on('yjs:sync', (data: { state: number[] }) => {
    const state = new Uint8Array(data.state)
    Y.applyUpdate(yDoc, state, 'remote')
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
