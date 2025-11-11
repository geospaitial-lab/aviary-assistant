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

import {
  type ChannelsType,
  type TypeType,
} from "@/components/assistant/data/add-data-source-dialog"
import { type VrtFormSchema } from "@/components/assistant/data/vrt/schema"
import { type WmsFormSchema } from "@/components/assistant/data/wms/schema"

export interface DataSource {
  id: string
  channels: ChannelsType
  type: TypeType
  formValues: WmsFormSchema | VrtFormSchema | null
}

interface DataState {
  dataSources: DataSource[]
  addDataSource: (channels: ChannelsType, type: TypeType) => void
  removeDataSource: (id: string) => void
  updateDataSource: (
    id: string,
    formValues: WmsFormSchema | VrtFormSchema,
  ) => void
  reset: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      dataSources: [],
      addDataSource: (channels, type) =>
        set((state) => ({
          dataSources: [
            ...state.dataSources,
            {
              id: crypto.randomUUID(),
              channels,
              type,
              formValues: null,
            },
          ],
        })),
      removeDataSource: (id) =>
        set((state) => ({
          dataSources: state.dataSources.filter(
            (dataSource) => dataSource.id !== id,
          ),
        })),
      updateDataSource: (id, formValues) =>
        set((state) => ({
          dataSources: state.dataSources.map((dataSource) =>
            dataSource.id === id ? { ...dataSource, formValues } : dataSource,
          ),
        })),
      reset: () => set({ dataSources: [] }),
    }),
    {
      name: "data-storage",
    },
  ),
)
