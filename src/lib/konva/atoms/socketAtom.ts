import { atom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import Konva from 'konva'
import { pushToHistoryAtom, removeLineAtom, undoAtom, redoAtom } from './historyAtom'
import { Drawing } from '../types'

type ServerToClientEvents = {
  join: (roomId: string) => void
  drawing: (drawings: Drawing[]) => void
  transform: (transforms: Drawing[]) => void
  remove: (ids: string[]) => void
  undo: (ids: string[]) => void
  redo: (drawings: Drawing[]) => void
}

type ClientToServerEvents = {
  join: (roomId: string) => void
  drawing: (roomId: string, drawings: Drawing[]) => void
  transform: (transforms: Drawing[]) => void
  remove: (ids: string[]) => void
  undo: (ids: string[]) => void
  redo: (drawings: Drawing[]) => void
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
export const initializeSocketAtom = atom(null, (get, set, roomId: string) => {
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
    // auth: { token, roomId },
  })

  // イベントリスナーを設定
  newSocket.on('connect', () => {
    set(socketConnectionAtom, true)
    set(socketErrorAtom, null)
    set(roomIdAtom, roomId)
    newSocket.emit('join', roomId)
  })

  newSocket.on('disconnect', () => {
    set(socketConnectionAtom, false)
  })

  newSocket.io.on('reconnect_failed', () => {
    set(socketConnectionAtom, false)
    set(socketErrorAtom, 'Connection failed')
  })

  newSocket.on('join', (roomId: string) => {
    console.log(`receive join: ${roomId}`)
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
