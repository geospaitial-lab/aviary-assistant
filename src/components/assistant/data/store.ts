import { create } from "zustand"
import { persist } from "zustand/middleware"

interface DataState {
  activeTab: string
  setActiveTab: (tab: string) => void
  reset: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      activeTab: "wms",
      setActiveTab: (tab) => set({ activeTab: tab }),
      reset: () => set({ activeTab: "wms" }),
    }),
    {
      name: "data-storage",
    },
  ),
)
