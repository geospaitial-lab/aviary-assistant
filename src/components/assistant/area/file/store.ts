import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type FileFormSchema } from "@/components/assistant/area/file/schema"
import { AllGeoJSON } from "@turf/helpers"

interface FileState {
  formValues: FileFormSchema | null
  geoJson: AllGeoJSON | null
  setFormValues: (values: FileFormSchema) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  reset: () => void
}

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      formValues: null,
      geoJson: null,
      setFormValues: (values) => set({ formValues: values }),
      setGeoJson: (geoJson) => set({ geoJson }),
      reset: () => set({ formValues: null, geoJson: null }),
    }),
    {
      name: "file-storage",
    },
  ),
)
