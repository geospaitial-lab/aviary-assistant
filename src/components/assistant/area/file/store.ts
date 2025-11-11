/*
 * Copyright (C) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import { del as idbDel, get as idbGet, set as idbSet } from "idb-keyval"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { type FileFormSchema } from "@/components/assistant/area/file/schema"
import { AllGeoJSON } from "@turf/helpers"

interface FileState {
  formValues: FileFormSchema | null
  fileName: string | null
  geoJson: AllGeoJSON | null
  isLoading: boolean
  setFormValues: (values: FileFormSchema) => void
  setFileName: (fileName: string) => void
  setGeoJson: (geoJson: AllGeoJSON) => void
  setIsLoading: (isLoading: boolean) => void
  reset: () => void
}

const GEOJSON_KEY = "file-geojson"

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      formValues: null,
      fileName: null,
      geoJson: null,
      isLoading: false,
      setFormValues: (values) => set({ formValues: values }),
      setFileName: (fileName) => set({ fileName }),
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
        set({
          formValues: null,
          fileName: null,
          geoJson: null,
          isLoading: false,
        })
        idbDel(GEOJSON_KEY).catch((error) => {
          console.error("Error deleting file GeoJSON during reset:", error)
        })
      },
    }),
    {
      name: "area-file-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formValues: state.formValues,
        fileName: state.fileName,
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
