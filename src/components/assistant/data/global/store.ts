import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type GlobalFormSchema } from "@/components/assistant/data/global/schema"

interface GlobalState {
  formValues: GlobalFormSchema | null
  setFormValues: (values: GlobalFormSchema) => void
  reset: () => void
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      reset: () => set({ formValues: null }),
    }),
    {
      name: "global-storage",
    },
  ),
)
