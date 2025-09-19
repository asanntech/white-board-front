import { useCallback } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import {
  socketAtom,
  roomIdAtom,
  socketConnectionAtom,
  socketErrorAtom,
  initializeSocketAtom,
  disconnectSocketAtom,
} from '../atoms/socketAtom'
import { Drawing, UndoRedoResult } from '../types'

// Socket接続を管理
export const useSocketManager = () => {
  const socket = useAtomValue(socketAtom)
  const roomId = useAtomValue(roomIdAtom)
  const isConnected = useAtomValue(socketConnectionAtom)
  const error = useAtomValue(socketErrorAtom)
  const initializeSocket = useSetAtom(initializeSocketAtom)
  const disconnectSocket = useSetAtom(disconnectSocketAtom)

  const emitDrawing = useCallback(
    (drawings: Drawing[]) => {
      if (!socket || !roomId) return
      socket.emit('drawing', { roomId, drawings })
    },
    [socket, roomId]
  )

  const emitTransform = useCallback(
    (drawings: Drawing[]) => {
      if (!socket || !roomId) return
      socket.emit('transform', { roomId, drawings })
    },
    [socket, roomId]
  )

  const emitRemove = useCallback(
    (ids: string[]) => {
      if (!socket || !roomId) return
      socket.emit('remove', { roomId, ids })
    },
    [socket, roomId]
  )

  const emitUndo = useCallback(
    (undoRedoResult: UndoRedoResult) => {
      if (!socket || !roomId) return
      socket.emit('undo', { roomId, undoRedoResult })
    },
    [socket, roomId]
  )

  const emitRedo = useCallback(
    (undoRedoResult: UndoRedoResult) => {
      if (!socket || !roomId) return
      socket.emit('redo', { roomId, undoRedoResult })
    },
    [socket, roomId]
  )

  return {
    socket,
    isConnected,
    error,
    emitDrawing,
    emitTransform,
    emitRemove,
    emitUndo,
    emitRedo,
    initializeSocket,
    disconnectSocket,
  }
}
