import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AreaState {
  activeTab: string
  setActiveTab: (tab: string) => void
  reset: () => void
}

export const useAreaStore = create<AreaState>()(
  persist(
    (set) => ({
      activeTab: "name",
      setActiveTab: (tab) => set({ activeTab: tab }),
      reset: () => set({ activeTab: "name" }),
    }),
    {
      name: "area-storage",
    },
  ),
)
