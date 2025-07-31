"use client"

import * as React from "react"

import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { useExportStore } from "@/components/assistant/export/store"
import { useModelStore } from "@/components/assistant/model/store"
import { useCpuStore } from "@/components/assistant/resources/cpu/store"
import { useGpuStore } from "@/components/assistant/resources/gpu/store"
import { useResourcesStore } from "@/components/assistant/resources/store"
import { useAssistantStore } from "@/components/assistant/store"
import { Button } from "@/components/ui/button"

function SummaryHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Zusammenfassung
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        TODO
      </h2>
    </>
  )
}

export function Summary() {
  const [isHydrated, setIsHydrated] = React.useState(false)

  const resetAreaStore = useAreaStore((state) => state.reset)
  const resetAssistantStore = useAssistantStore((state) => state.reset)
  const resetBoundingBoxStore = useBoundingBoxStore((state) => state.reset)
  const resetCpuStore = useCpuStore((state) => state.reset)
  const resetExportStore = useExportStore((state) => state.reset)
  const resetFileStore = useFileStore((state) => state.reset)
  const resetGpuStore = useGpuStore((state) => state.reset)
  const resetModelStore = useModelStore((state) => state.reset)
  const resetNameStore = useNameStore((state) => state.reset)
  const resetResourcesStore = useResourcesStore((state) => state.reset)

  const storeKeys = [
    "area-storage",
    "assistant-storage",
    "bounding-box-storage",
    "cpu-storage",
    "export-storage",
    "file-storage",
    "gpu-storage",
    "model-storage",
    "name-storage",
    "resources-storage",
  ]

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleReset = () => {
    resetAreaStore()
    resetBoundingBoxStore()
    resetNameStore()
    resetFileStore()
    resetExportStore()
    resetAssistantStore()
    resetResourcesStore()
    resetCpuStore()
    resetGpuStore()
    resetModelStore()

    storeKeys.forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <SummaryHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <SummaryHeadings />

        <div className="mt-8 flex justify-center">
          <Button onClick={handleReset}>Neue Konfiguration</Button>
        </div>
      </div>
    </div>
  )
}
