import { StateCreator } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { YjsUpdatePayload, YjsSyncInitPayload } from '../types'
import { KonvaStore } from './types'
import { decodeUpdate } from './yjsSlice'

type ServerToClientEvents = {
  userEntered: (userId: string) => void
  'yjs-sync-init': (payload: YjsSyncInitPayload) => void
  'yjs-update': (payload: YjsUpdatePayload) => void
}

export type ClientToServerEvents = {
  join: (params: { roomId: string }) => void
  'yjs-update': (payload: YjsUpdatePayload) => void
}

export type SocketSlice = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean
  socketError: string | null
  roomId: string | null
  initializeSocket: (roomId: string, token: string) => void
  disconnectSocket: () => void
}

export const createSocketSlice: StateCreator<KonvaStore, [], [], SocketSlice> = (set, get) => ({
  socket: null,
  isConnected: false,
  socketError: null,
  roomId: null,

  initializeSocket: (roomId, token) => {
    const currentSocket = get().socket

    if (currentSocket) {
      currentSocket.disconnect()
    }

    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      process.env.NEXT_PUBLIC_WS_WHITE_BOARD,
      {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        auth: { token },
      }
    )

    newSocket.on('connect', () => {
      set({ isConnected: true, socketError: null, roomId })
      get().initYjs()
      newSocket.emit('join', { roomId })
    })

    newSocket.on('disconnect', () => {
      set({ isConnected: false })
    })

    newSocket.io.on('reconnect_failed', () => {
      set({ isConnected: false, socketError: 'Connection failed' })
    })

    newSocket.on('userEntered', (userId: string) => {
      console.log(`user ${userId} entered the room`)
    })

    newSocket.on('yjs-sync-init', (payload: YjsSyncInitPayload) => {
      const state = decodeUpdate(payload.state)
      get().applyInitialState(state)
    })

    newSocket.on('yjs-update', (payload: YjsUpdatePayload) => {
      const update = decodeUpdate(payload.update)
      get().applyUpdate(update)
    })

    set({ socket: newSocket })
  },

  disconnectSocket: () => {
    const socket = get().socket
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false, socketError: null, roomId: null })
    }
  },
})
