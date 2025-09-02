import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type ModelFormSchema } from "@/components/assistant/model/schema"

interface ModelState {
  formValues: ModelFormSchema
  setFormValues: (values: ModelFormSchema) => void
  reset: () => void
}

export const useModelStore = create<ModelState>()(
  persist(
    (set) => ({
      formValues: {
        model1: false,
        model2: false,
      },
      setFormValues: (values) => set({ formValues: values }),
      reset: () =>
        set({
          formValues: {
            model1: false,
            model2: false,
          },
        }),
    }),
    {
      name: "model-storage",
    },
  ),
)
