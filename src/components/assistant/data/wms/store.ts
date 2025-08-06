import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type WmsFormSchema } from "@/components/assistant/data/wms/schema"

interface WmsState {
  formValues: WmsFormSchema | null
  setFormValues: (values: WmsFormSchema) => void
  reset: () => void
}

export const useWmsStore = create<WmsState>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      reset: () => set({ formValues: null }),
    }),
    {
      name: "wms-storage",
    },
  ),
)
