import { create } from 'zustand'

type EIP7702State = {
  eip7702: boolean
  setEIP7702: (enabled: boolean) => void
  toggleEIP7702: () => void
}

export const useEIP7702Store = create<EIP7702State>((set, get) => ({
  eip7702: false,
  setEIP7702: (enabled: boolean) => set({ eip7702: enabled }),
  toggleEIP7702: () => set({ eip7702: !get().eip7702 }),
}))
