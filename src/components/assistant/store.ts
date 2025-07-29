import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AssistantState {
  activeStep: string
  setActiveStep: (step: string) => void
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      activeStep: "model",
      setActiveStep: (step) => set({ activeStep: step }),
    }),
    {
      name: "assistant-storage",
    },
  ),
)
