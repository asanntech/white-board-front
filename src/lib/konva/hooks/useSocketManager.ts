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

  const emitDrawingEnd = useCallback(
    (drawing: Drawing) => {
      if (!socket || !roomId) return
      socket.emit('drawingEnd', { roomId, drawing })
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
    (drawings: Drawing[]) => {
      if (!socket || !roomId) return
      socket.emit('remove', { roomId, drawings })
    },
    [socket, roomId]
  )

  const emitUndo = useCallback(
    (undoResult: UndoRedoResult) => {
      if (!socket || !roomId) return
      socket.emit('undo', { roomId, undoResult })
    },
    [socket, roomId]
  )

  const emitRedo = useCallback(
    (redoResult: UndoRedoResult) => {
      if (!socket || !roomId) return
      socket.emit('redo', { roomId, redoResult })
    },
    [socket, roomId]
  )

  return {
    socket,
    isConnected,
    error,
    emitDrawing,
    emitDrawingEnd,
    emitTransform,
    emitRemove,
    emitUndo,
    emitRedo,
    initializeSocket,
    disconnectSocket,
  }
}
