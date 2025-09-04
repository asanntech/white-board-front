import { atom } from 'jotai'
import { Drawing } from '../types'

export const toolAtom = atom<Drawing>('pen')
