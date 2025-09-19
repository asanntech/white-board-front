import { atom } from 'jotai'

// キャンバスの準備ができたかどうかを管理
export const isReadyCanvasAtom = atom<boolean>(false)
