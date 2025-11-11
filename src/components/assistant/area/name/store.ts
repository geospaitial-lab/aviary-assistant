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

import { type NameFormSchema } from "@/components/assistant/area/name/schema"
import { AllGeoJSON } from "@turf/helpers"

interface NameState {
  formValues: NameFormSchema | null
  center: { lat: number; lon: number } | null
  osmId: number | null
  geoJson: AllGeoJSON | null
  isLoading: boolean
  setFormValues: (values: NameFormSchema) => void
  setCenter: (center: { lat: number; lon: number }) => void
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
      center: null,
      osmId: null,
      geoJson: null,
      isLoading: false,
      setFormValues: (values) => set({ formValues: values }),
      setCenter: (center) => set({ center }),
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
        set({
          formValues: null,
          center: null,
          osmId: null,
          geoJson: null,
          isLoading: false,
        })
        idbDel(GEOJSON_KEY).catch((error) => {
          console.error("Error deleting name GeoJSON during reset:", error)
        })
      },
    }),
    {
      name: "area-name-storage",
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
