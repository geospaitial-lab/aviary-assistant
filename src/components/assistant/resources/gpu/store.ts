import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type GpuFormSchema } from "@/components/assistant/resources/gpu/schema"

interface GpuState {
  formValues: GpuFormSchema
  setFormValues: (values: GpuFormSchema) => void
  reset: () => void
}

export const useGpuStore = create<GpuState>()(
  persist(
    (set) => ({
      formValues: {
        vram: 1,
      },
      setFormValues: (values) => set({ formValues: values }),
      reset: () =>
        set({
          formValues: {
            vram: 1,
          },
        }),
    }),
    {
      name: "resources-gpu-storage",
    },
  ),
)
