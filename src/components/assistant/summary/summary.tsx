"use client"

import * as React from "react"

import { CircleAlert } from "lucide-react"

import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { useDataStore } from "@/components/assistant/data/store"
import { useExportStore } from "@/components/assistant/export/store"
import { useModelStore } from "@/components/assistant/model/store"
import { useCpuStore } from "@/components/assistant/resources/cpu/store"
import { useGpuStore } from "@/components/assistant/resources/gpu/store"
import { useResourcesStore } from "@/components/assistant/resources/store"
import { useAssistantStore } from "@/components/assistant/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const resetAreaStore = useAreaStore((state) => state.reset)
  const resetAssistantStore = useAssistantStore((state) => state.reset)
  const resetBoundingBoxStore = useBoundingBoxStore((state) => state.reset)
  const resetCpuStore = useCpuStore((state) => state.reset)
  const resetDataStore = useDataStore((state) => state.reset)
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
    "data-storage",
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

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleConfirmReset = () => {
    resetAreaStore()
    resetAssistantStore()
    resetBoundingBoxStore()
    resetCpuStore()
    resetDataStore()
    resetExportStore()
    resetFileStore()
    resetGpuStore()
    resetModelStore()
    resetNameStore()
    resetResourcesStore()

    storeKeys.forEach((key) => {
      localStorage.removeItem(key)
    })

    setIsDialogOpen(false)
  }

  const handleCancelReset = () => {
    setIsDialogOpen(false)
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
          <Button onClick={handleOpenDialog}>Neue Konfiguration</Button>
        </div>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <CircleAlert aria-hidden="true" />
                  Konfiguration zurücksetzen
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bist du sicher, dass du eine neue erstellen möchtest? Dabei geht
                deine aktuelle Konfiguration verloren.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelReset}>
                Abbrechen
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmReset}>
                Bestätigen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
