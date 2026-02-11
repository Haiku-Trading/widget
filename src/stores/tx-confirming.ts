import { create } from 'zustand'

type TransactionConfirmingState = {
    isConfirming: boolean
    updateTransactionConfirming: (isConfirming: boolean) => void
}

export const useTransactionConfirmingStore = create<TransactionConfirmingState>((set) => ({
    isConfirming: false,
    updateTransactionConfirming: (isConfirming: boolean) => {
        set({ isConfirming })
    }
}))
