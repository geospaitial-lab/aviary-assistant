import { del as idbDel, get as idbGet, set as idbSet } from "idb-keyval"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { type NameFormSchema } from "@/components/assistant/area/name/schema"
import { AllGeoJSON } from "@turf/helpers"

interface NameState {
  formValues: NameFormSchema | null
  osmId: number | null
  geoJson: AllGeoJSON | null
  isLoading: boolean
  setFormValues: (values: NameFormSchema) => void
  setOsmId: (osmId: number) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  setIsLoading: (isLoading: boolean) => void
  reset: () => void
}

const GEOJSON_KEY = "name-geojson"

export const useNameStore = create<NameState>()(
  persist(
    (set) => ({
      formValues: null,
      osmId: null,
      geoJson: null,
      isLoading: false,
      setFormValues: (values) => set({ formValues: values }),
      setOsmId: (osmId) => set({ osmId }),
      setGeoJson: (geoJson) => {
        set({ geoJson })
        if (geoJson) {
          idbSet(GEOJSON_KEY, geoJson).catch((error) => {
            console.error("Error saving name GeoJSON to IndexedDB:", error)
          })
        } else {
          idbDel(GEOJSON_KEY).catch((error) => {
            console.error("Error deleting name GeoJSON from IndexedDB:", error)
          })
        }
      },
      setIsLoading: (isLoading) => set({ isLoading: isLoading }),
      reset: () => {
        set({ formValues: null, osmId: null, geoJson: null, isLoading: false })
        idbDel(GEOJSON_KEY).catch((error) => {
          console.error("Error deleting name GeoJSON during reset:", error)
        })
      },
    }),
    {
      name: "name-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formValues: state.formValues,
        osmId: state.osmId,
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
