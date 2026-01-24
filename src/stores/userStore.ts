import { create } from 'zustand'

type UserStore = {
  userId: string | undefined
  setUserId: (userId: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  userId: undefined,
  setUserId: (userId) => set({ userId }),
}))
