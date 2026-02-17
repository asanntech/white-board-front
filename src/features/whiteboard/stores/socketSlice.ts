import { StateCreator } from 'zustand'
import { io, Socket } from 'socket.io-client'
import Konva from 'konva'
import { Drawing, UndoRedoResult, YjsUpdatePayload, YjsSyncInitPayload } from '../types'
import { KonvaStore } from './types'

type ServerToClientEvents = {
  drawing: (drawings: Drawing[]) => void
  drawingEnd: (drawing: Drawing) => void
  transform: (transforms: Drawing[]) => void
  remove: (drawings: Drawing[]) => void
  undoDrawings: (undoResult: UndoRedoResult) => void
  redoDrawings: (redoResult: UndoRedoResult) => void
  roomData: (drawings: Drawing[]) => void
  userEntered: (userId: string) => void
  'yjs-sync-init': (payload: YjsSyncInitPayload) => void
  'yjs-update': (payload: YjsUpdatePayload) => void
}

export type ClientToServerEvents = {
  join: (params: { roomId: string }) => void
  drawing: (params: { roomId: string; drawings: Drawing[] }) => void
  drawingEnd: (params: { roomId: string; drawing: Drawing }) => void
  transform: (params: { roomId: string; drawings: Drawing[] }) => void
  remove: (params: { roomId: string; drawings: Drawing[] }) => void
  undo: (params: { roomId: string; undoResult: UndoRedoResult }) => void
  redo: (params: { roomId: string; redoResult: UndoRedoResult }) => void
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
      newSocket.emit('join', { roomId })
    })

    newSocket.on('disconnect', () => {
      set({ isConnected: false })
    })

    newSocket.io.on('reconnect_failed', () => {
      set({ isConnected: false, socketError: 'Connection failed' })
    })

    newSocket.on('roomData', (drawings: Drawing[]) => {
      const newLineNodes = drawings.map((drawing) => new Konva.Line({ ...drawing }))
      get().initHistory(newLineNodes)
    })

    newSocket.on('userEntered', (userId: string) => {
      console.log(`user ${userId} entered the room`)
    })

    newSocket.on('drawing', (drawings: Drawing[]) => {
      const newLineNodes = drawings.map((drawing) => new Konva.Line({ ...drawing }))
      get().pushToHistory(newLineNodes, true)
    })

    newSocket.on('drawingEnd', (drawing: Drawing) => {
      const newLineNode = new Konva.Line({ ...drawing })
      get().updateLine([newLineNode])
    })

    newSocket.on('transform', (transforms: Drawing[]) => {
      const newLineNodes = transforms.map((transform) => new Konva.Line({ ...transform }))
      get().pushToHistory(newLineNodes, true)
    })

    newSocket.on('remove', (drawings: Drawing[]) => {
      const ids = drawings.map((drawing) => drawing.id)
      get().removeLine(ids, true)
    })

    newSocket.on('undoDrawings', (undoResult: UndoRedoResult) => {
      handleUndoRedoResult(get, undoResult)
    })

    newSocket.on('redoDrawings', (redoResult: UndoRedoResult) => {
      handleUndoRedoResult(get, redoResult)
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

function handleUndoRedoResult(get: () => KonvaStore, result: UndoRedoResult) {
  const drawings = result.objects
  switch (result.action) {
    case 'delete': {
      const ids = drawings.map((drawing) => drawing.id)
      get().removeLine(ids, true)
      break
    }
    case 'restore':
    case 'transform': {
      const newLineNodes = drawings.map((drawing) => new Konva.Line({ ...drawing }))
      get().pushToHistory(newLineNodes, true)
      break
    }
  }
}
