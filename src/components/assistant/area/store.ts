import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AreaState {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useAreaStore = create<AreaState>()(
  persist(
    (set) => ({
      activeTab: "name",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "area-storage",
      skipHydration: true,
    },
  ),
)

if (typeof window !== "undefined") {
  useAreaStore.persist.rehydrate()
}
