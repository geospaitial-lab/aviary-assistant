import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type VrtFormSchema } from "@/components/assistant/data/vrt/schema"

interface VrtState {
  formValues: VrtFormSchema | null
  setFormValues: (values: VrtFormSchema) => void
  reset: () => void
}

export const useVrtStore = create<VrtState>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      reset: () => set({ formValues: null }),
    }),
    {
      name: "data-vrt-storage",
    },
  ),
)
