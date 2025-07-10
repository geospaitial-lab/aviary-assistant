import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type ExportFormSchema } from "@/components/assistant/export/schema"

interface ExportState {
  formValues: ExportFormSchema | null
  setFormValues: (values: ExportFormSchema) => void
}

export const useExportStore = create<ExportState>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      reset: () => set({ formValues: null }),
    }),
    {
      name: "export-storage",
    },
  ),
)
