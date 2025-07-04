import { create } from "zustand"
import { persist } from "zustand/middleware"

import { AllGeoJSON } from "@turf/helpers"

import { type BoundingBoxFormSchema } from "./schema"

interface BoundingBoxState {
  formValues: BoundingBoxFormSchema | null
  geoJson: AllGeoJSON | null
  setFormValues: (values: BoundingBoxFormSchema) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  reset: () => void
}

export const useBoundingBoxStore = create<BoundingBoxState>()(
  persist(
    (set) => ({
      formValues: null,
      geoJson: null,
      setFormValues: (values) => set({ formValues: values }),
      setGeoJson: (geoJson) => set({ geoJson }),
      reset: () => set({ formValues: null, geoJson: null }),
    }),
    {
      name: "bounding-box-storage",
    },
  ),
)
