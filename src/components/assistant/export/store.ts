import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type ExportFormSchema } from "@/components/assistant/export/schema"

interface ExportState {
  formValues: ExportFormSchema
  setFormValues: (values: ExportFormSchema) => void
  reset: () => void
}

export const useExportStore = create<ExportState>()(
  persist(
    (set) => ({
      formValues: {
        dirPath: "",
      },
      setFormValues: (values) => set({ formValues: values }),
      reset: () =>
        set({
          formValues: {
            dirPath: "",
          },
        }),
    }),
    {
      name: "export-storage",
    },
  ),
)
