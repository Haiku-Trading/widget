import { createStore } from 'zustand/vanilla'
import { v4 as uuidv4 } from 'uuid'

export type SessionState = {
  sessionId: string
}

export type SessionActions = {
  updateSessionId: () => void
}

export type SessionStore = SessionState & SessionActions

export const defaultInitState: SessionState = {
  sessionId: uuidv4(),
}

export const createSessionStore = (initState: SessionState = defaultInitState) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    updateSessionId: () => set({ sessionId: uuidv4() }),
  }))
}
