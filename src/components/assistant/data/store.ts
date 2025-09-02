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
