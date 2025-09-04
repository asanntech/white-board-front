import { atom } from 'jotai'

// キーの押下状態を管理するatom
export const keyPressStateAtom = atom<Record<string, boolean>>({})

// よく使われるキーのatomを事前定義
export const spaceKeyPressAtom = atom((get) => get(keyPressStateAtom)['Space'] || false)
