import { del as idbDel, get as idbGet, set as idbSet } from "idb-keyval"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { type FileFormSchema } from "@/components/assistant/area/file/schema"
import { AllGeoJSON } from "@turf/helpers"

interface FileState {
  formValues: FileFormSchema | null
  geoJson: AllGeoJSON | null
  isLoading: boolean
  setFormValues: (values: FileFormSchema) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  setIsLoading: (isLoading: boolean) => void
  reset: () => void
}

const GEOJSON_KEY = "file-geojson"

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      formValues: null,
      geoJson: null,
      isLoading: false,
      setFormValues: (values) => set({ formValues: values }),
      setGeoJson: (geoJson) => {
        set({ geoJson })
        if (geoJson) {
          idbSet(GEOJSON_KEY, geoJson).catch((error) => {
            console.error("Error saving file GeoJSON to IndexedDB:", error)
          })
        } else {
          idbDel(GEOJSON_KEY).catch((error) => {
            console.error("Error deleting file GeoJSON from IndexedDB:", error)
          })
        }
      },
      setIsLoading: (isLoading) => set({ isLoading: isLoading }),
      reset: () => {
        set({ formValues: null, geoJson: null, isLoading: false })
        idbDel(GEOJSON_KEY).catch((error) => {
          console.error("Error deleting file GeoJSON during reset:", error)
        })
      },
    }),
    {
      name: "file-storage",
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
