import { useCallback } from 'react'
import { useWhiteboardStore } from '../stores'
import { Drawing, UndoRedoResult } from '../types'

// Socket接続を管理
export const useSocketManager = () => {
  const socket = useWhiteboardStore((s) => s.socket)
  const roomId = useWhiteboardStore((s) => s.roomId)
  const isConnected = useWhiteboardStore((s) => s.isConnected)
  const error = useWhiteboardStore((s) => s.socketError)
  const initializeSocket = useWhiteboardStore((s) => s.initializeSocket)
  const disconnectSocket = useWhiteboardStore((s) => s.disconnectSocket)

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
