import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AssistantState {
  activeStep: string
  setActiveStep: (step: string) => void
  reset: () => void
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      activeStep: "model",
      setActiveStep: (step) => set({ activeStep: step }),
      reset: () => set({ activeStep: "model" }),
    }),
    {
      name: "assistant-storage",
    },
  ),
)
