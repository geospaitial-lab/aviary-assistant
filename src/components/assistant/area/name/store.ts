import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type NameFormSchema } from "@/components/assistant/area/name/schema"
import { AllGeoJSON } from "@turf/helpers"

interface NameState {
  formValues: NameFormSchema | null
  osmId: number | null
  geoJson: AllGeoJSON | null
  setFormValues: (values: NameFormSchema) => void
  setOsmId: (osmId: number) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  reset: () => void
}

export const useNameStore = create<NameState>()(
  persist(
    (set) => ({
      formValues: null,
      osmId: null,
      geoJson: null,
      setFormValues: (values) => set({ formValues: values }),
      setOsmId: (osmId) => set({ osmId }),
      setGeoJson: (geoJson) => set({ geoJson }),
      reset: () => set({ formValues: null, osmId: null, geoJson: null }),
    }),
    {
      name: "name-storage",
    },
  ),
)
