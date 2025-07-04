import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type NameFormSchema } from "@/components/assistant/area/name/schema"
import { AllGeoJSON } from "@turf/helpers"

interface NameState {
  formValues: NameFormSchema | null
  geoJson: AllGeoJSON | null
  setFormValues: (values: NameFormSchema) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  reset: () => void
}

export const useNameStore = create<NameState>()(
  persist(
    (set) => ({
      formValues: null,
      geoJson: null,
      setFormValues: (values) => set({ formValues: values }),
      setGeoJson: (geoJson) => set({ geoJson }),
      reset: () => set({ formValues: null, geoJson: null }),
    }),
    {
      name: "name-storage",
    },
  ),
)
