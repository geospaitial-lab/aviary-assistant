import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type CpuFormSchema } from "@/components/assistant/resources/cpu/schema"

interface CpuState {
  formValues: CpuFormSchema | null
  setFormValues: (values: CpuFormSchema) => void
}

export const useCpuStore = create<CpuState>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      reset: () => set({ formValues: null }),
    }),
    {
      name: "cpu-storage",
    },
  ),
)
