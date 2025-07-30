import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type ModelFormSchema } from "@/components/assistant/model/schema"

interface ModelState {
  formValues: ModelFormSchema | null
  setFormValues: (values: ModelFormSchema) => void
  reset: () => void
}

export const useModelStore = create<ModelState>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      reset: () => set({ formValues: null }),
    }),
    {
      name: "model-storage",
    },
  ),
)
