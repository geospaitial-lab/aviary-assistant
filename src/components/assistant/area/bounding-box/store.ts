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
            console.error(
              "Error saving bounding box GeoJSON to IndexedDB:",
              error,
            )
          })
        } else {
          idbDel(GEOJSON_KEY).catch((error) => {
            console.error(
              "Error deleting bounding box GeoJSON from IndexedDB:",
              error,
            )
          })
        }
      },
      reset: () => {
        set({ formValues: null, geoJson: null })
        idbDel(GEOJSON_KEY).catch((error) => {
          console.error(
            "Error deleting bounding box GeoJSON during reset:",
            error,
          )
        })
      },
    }),
    {
      name: "area-bounding-box-storage",
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
