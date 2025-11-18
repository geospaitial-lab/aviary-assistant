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
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type GpkgFormSchema } from "@/components/assistant/aggregation/gpkg/schema"

export interface AggregationSource {
  id: string
  formValues: GpkgFormSchema | null
}

interface AggregationState {
  aggregationSources: AggregationSource[]
  addAggregationSource: () => void
  removeAggregationSource: (id: string) => void
  updateAggregationSource: (id: string, formValues: GpkgFormSchema) => void
  reset: () => void
}

export const useAggregationStore = create<AggregationState>()(
  persist(
    (set) => ({
      aggregationSources: [],
      addAggregationSource: () =>
        set((state) => ({
          aggregationSources: [
            ...state.aggregationSources,
            {
              id: crypto.randomUUID(),
              formValues: null,
            },
          ],
        })),
      removeAggregationSource: (id) =>
        set((state) => ({
          aggregationSources: state.aggregationSources.filter(
            (aggregationSource) => aggregationSource.id !== id,
          ),
        })),
      updateAggregationSource: (id, formValues) =>
        set((state) => ({
          aggregationSources: state.aggregationSources.map(
            (aggregationSource) =>
              aggregationSource.id === id
                ? { ...aggregationSource, formValues }
                : aggregationSource,
          ),
        })),
      reset: () => set({ aggregationSources: [] }),
    }),
    {
      name: "aggregation-storage",
    },
  ),
)
