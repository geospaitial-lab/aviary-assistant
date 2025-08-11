import { del as idbDel, get as idbGet, set as idbSet } from "idb-keyval"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { type BoundingBoxFormSchema } from "@/components/assistant/area/bounding-box/schema"
import { AllGeoJSON } from "@turf/helpers"

interface BoundingBoxState {
  formValues: BoundingBoxFormSchema | null
  geoJson: AllGeoJSON | null
  setFormValues: (values: BoundingBoxFormSchema) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  reset: () => void
}

const GEOJSON_KEY = "bounding-box-geojson"

export const useBoundingBoxStore = create<BoundingBoxState>()(
  persist(
    (set) => ({
      formValues: null,
      geoJson: null,
      setFormValues: (values) => set({ formValues: values }),
      setGeoJson: (geoJson) => {
        set({ geoJson })
        if (geoJson) {
          idbSet(GEOJSON_KEY, geoJson).catch((error) => {
            console.error("Error saving bounding box GeoJSON to IndexedDB:", error)
          })
        } else {
          idbDel(GEOJSON_KEY).catch((error) => {
            console.error("Error deleting bounding box GeoJSON from IndexedDB:", error)
          })
        }
      },
      reset: () => {
        set({ formValues: null, geoJson: null })
        idbDel(GEOJSON_KEY).catch((error) => {
          console.error("Error deleting bounding box GeoJSON during reset:", error)
        })
      },
    }),
    {
      name: "bounding-box-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formValues: state.formValues,
      }),
      onRehydrateStorage: () => async (state) => {
        const savedGeoJson = await idbGet<AllGeoJSON>(GEOJSON_KEY)
        if (savedGeoJson) {
          state?.setGeoJson(savedGeoJson)
        }
      },
    },
  ),
)
