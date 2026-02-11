import { create } from 'zustand'

type SolveIntentErrorState = {
    solveIntentErrors: Record<string, {
        errorMessage: string,
        lastCall: string,
    }>
    updateSolveIntentErrors: (payloadKey: string, errorMessage: string, lastCall: string) => void
    removeSolveIntentError: (payloadKey: string) => void
    cleanSolveIntentErrors: () => void
}

export const useSolveIntentErrorStore = create<SolveIntentErrorState>((set) => ({
    solveIntentErrors: {},
    updateSolveIntentErrors: (payloadKey: string, errorMessage: string, lastCall: string) => {
        set((state) => ({
            solveIntentErrors: {
                ...state.solveIntentErrors,
                [payloadKey]: {
                    errorMessage,
                    lastCall
                }
            }
        }))
    },
    removeSolveIntentError: (payloadKey: string) => set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [payloadKey]: _, ...rest } = state.solveIntentErrors ?? {};
        return {
            solveIntentErrors: { ...rest },
        };
    }),
    cleanSolveIntentErrors: () => set({ solveIntentErrors: {} })
}))
