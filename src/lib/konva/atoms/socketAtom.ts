import { atom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import Konva from 'konva'
import { pushToHistoryAtom, removeLineAtom, undoAtom, redoAtom } from './drawingHistoryAtom'
import { Drawing } from '../types'

type ServerToClientEvents = {
  drawing: (drawings: Drawing[]) => void
  transform: (transforms: Drawing[]) => void
  remove: (ids: string[]) => void
  undo: (ids: string[]) => void
  redo: (drawings: Drawing[]) => void
  roomData: (drawings: Drawing[]) => void
  userEntered: (userId: string) => void
}

export type ClientToServerEvents = {
  join: (params: { roomId: string }) => void
  drawing: (params: { roomId: string; drawings: Drawing[] }) => void
  transform: (params: { roomId: string; drawings: Drawing[] }) => void
  remove: (params: { roomId: string; ids: string[] }) => void
  undo: (params: { roomId: string; drawings: Drawing[] }) => void
  redo: (params: { roomId: string; drawings: Drawing[] }) => void
}

// Socketインスタンスを管理するAtom
export const socketAtom = atom<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

// 接続状態を管理するAtom
export const socketConnectionAtom = atom<boolean>(false)

// エラー状態を管理するAtom
export const socketErrorAtom = atom<string | null>(null)

// ルームIDを管理するAtom
export const roomIdAtom = atom<string | null>(null)

// Socketを初期化するAtom
export const initializeSocketAtom = atom(null, (get, set, roomId: string, token: string) => {
  const currentSocket = get(socketAtom)

  // 既存のSocketがあれば切断
  if (currentSocket) {
    currentSocket.disconnect()
  }

  const newSocket = io(process.env.NEXT_PUBLIC_WS_WHITE_BOARD, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    auth: { token },
  })

  // イベントリスナーを設定
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

  newSocket.on('roomData', (drawings: Drawing[]) => {
    const newLineNodes = drawings.map((drawing) => new Konva.Line({ ...drawing }))
    set(pushToHistoryAtom, newLineNodes)
  })

  newSocket.on('userEntered', (userId: string) => {
    console.log(`user ${userId} entered the room`)
  })

  newSocket.on('drawing', (drawings: Drawing[]) => {
    const newLineNodes = drawings.map((drawing) => new Konva.Line({ ...drawing }))
    set(pushToHistoryAtom, newLineNodes)
  })

  newSocket.on('transform', (transforms: Drawing[]) => {
    const newLineNodes = transforms.map((transform) => new Konva.Line({ ...transform }))
    set(pushToHistoryAtom, newLineNodes)
  })

  newSocket.on('remove', (ids: string[]) => {
    set(removeLineAtom, ids)
  })

  newSocket.on('undo', (ids: string[]) => {
    console.log(`receive undo: ${ids}`)
    set(undoAtom)
  })

  newSocket.on('redo', (drawings: Drawing[]) => {
    console.log(`receive redo: ${drawings}`)
    set(redoAtom)
  })

  set(socketAtom, newSocket)
})

// Socketを切断するAtom
export const disconnectSocketAtom = atom(null, (get, set) => {
  const socket = get(socketAtom)
  if (socket) {
    socket.disconnect()
    set(socketAtom, null)
    set(socketConnectionAtom, false)
    set(socketErrorAtom, null)
  }
})
