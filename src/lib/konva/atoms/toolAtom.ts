import { atom } from 'jotai'
import { Tool } from '../types'

// ツール状態
export const toolAtom = atom<Tool>('select')
