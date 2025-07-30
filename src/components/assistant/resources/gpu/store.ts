import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type GpuFormSchema } from "@/components/assistant/resources/gpu/schema"

interface GpuState {
  formValues: GpuFormSchema | null
  setFormValues: (values: GpuFormSchema) => void
  reset: () => void
}

export const useGpuStore = create<GpuState>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      reset: () => set({ formValues: null }),
    }),
    {
      name: "gpu-storage",
    },
  ),
)
