import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type CpuFormSchema } from "@/components/assistant/resources/cpu/schema"

interface CpuState {
  formValues: CpuFormSchema
  setFormValues: (values: CpuFormSchema) => void
  reset: () => void
}

export const useCpuStore = create<CpuState>()(
  persist(
    (set) => ({
      formValues: {
        ram: 1,
      },
      setFormValues: (values) => set({ formValues: values }),
      reset: () =>
        set({
          formValues: {
            ram: 1,
          },
        }),
    }),
    {
      name: "resources-cpu-storage",
    },
  ),
)
