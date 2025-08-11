import { del as idbDel, get as idbGet, set as idbSet } from "idb-keyval"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { type FileFormSchema } from "@/components/assistant/area/file/schema"
import { AllGeoJSON } from "@turf/helpers"

interface FileState {
  formValues: FileFormSchema | null
  geoJson: AllGeoJSON | null
  setFormValues: (values: FileFormSchema) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  reset: () => void
}

const GEOJSON_KEY = "file-geojson"

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      formValues: null,
      geoJson: null,
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
      reset: () => {
        set({ formValues: null, geoJson: null })
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
