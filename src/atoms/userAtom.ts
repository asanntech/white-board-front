import { atom } from 'jotai'
import { AuthVerifyResponseDto } from '@/lib/open-api/api-client'

export const userAtom = atom<AuthVerifyResponseDto | null>(null)
