import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ResourcesState {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useResourcesStore = create<ResourcesState>()(
  persist(
    (set) => ({
      activeTab: "cpu",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "resources-storage",
    },
  ),
)
