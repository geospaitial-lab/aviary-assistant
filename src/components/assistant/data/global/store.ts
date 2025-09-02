import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type GlobalFormSchema } from "@/components/assistant/data/global/schema"

interface GlobalState {
  formValues: GlobalFormSchema
  setFormValues: (values: GlobalFormSchema) => void
  reset: () => void
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      formValues: {
        epsgCode: "25832",
        groundSamplingDistance: "0.2",
      },
      setFormValues: (values) => set({ formValues: values }),
      reset: () =>
        set({
          formValues: {
            epsgCode: "25832",
            groundSamplingDistance: "0.2",
          },
        }),
    }),
    {
      name: "data-global-storage",
    },
  ),
)
