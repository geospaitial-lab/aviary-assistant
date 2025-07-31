"use client"

import * as React from "react"

import { History } from "lucide-react"

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

export function ResumeAlert() {
  const [isOpen, setIsOpen] = React.useState(false)

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
    const hasExistingSession = storeKeys.some((key) => {
      if (key === "assistant-storage") {
        return false
      }

      const item = localStorage.getItem(key)
      if (!item) return false

      if (key === "model-storage") {
        const modelStore = JSON.parse(item)
        if (
          modelStore.state.formValues.model1 === false &&
          modelStore.state.formValues.model2 === false
        ) {
          return false
        }
      }

      return true
    })

    if (hasExistingSession) {
      setIsOpen(true)
    }
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

    setIsOpen(false)
  }

  const handleResume = () => {
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-2">
              <History aria-hidden="true" />
              Vorherige Konfiguration gefunden
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Möchtest du diese fortsetzen oder eine neue erstellen?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReset}>
            Neue Konfiguration
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleResume}>
            Fortsetzen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
