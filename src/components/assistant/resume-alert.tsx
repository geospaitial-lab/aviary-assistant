"use client"

import * as React from "react"

import { History } from "lucide-react"

import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { useGlobalStore } from "@/components/assistant/data/global/store"
import { useDataStore } from "@/components/assistant/data/store"
import { useVrtStore } from "@/components/assistant/data/vrt/store"
import { useWmsStore } from "@/components/assistant/data/wms/store"
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

interface ResumeAlertProps {
  onReset?: () => void
}

export function ResumeAlert({ onReset }: ResumeAlertProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const resetAreaStore = useAreaStore((state) => state.reset)
  const resetAssistantStore = useAssistantStore((state) => state.reset)
  const resetBoundingBoxStore = useBoundingBoxStore((state) => state.reset)
  const resetCpuStore = useCpuStore((state) => state.reset)
  const resetDataStore = useDataStore((state) => state.reset)
  const resetExportStore = useExportStore((state) => state.reset)
  const resetFileStore = useFileStore((state) => state.reset)
  const resetGlobalStore = useGlobalStore((state) => state.reset)
  const resetGpuStore = useGpuStore((state) => state.reset)
  const resetModelStore = useModelStore((state) => state.reset)
  const resetNameStore = useNameStore((state) => state.reset)
  const resetResourcesStore = useResourcesStore((state) => state.reset)
  const resetVrtStore = useVrtStore((state) => state.reset)
  const resetWmsStore = useWmsStore((state) => state.reset)

  const storeKeys = [
    "area-storage",
    "assistant-storage",
    "bounding-box-storage",
    "cpu-storage",
    "data-storage",
    "export-storage",
    "file-storage",
    "global-storage",
    "gpu-storage",
    "model-storage",
    "name-storage",
    "resources-storage",
    "vrt-storage",
    "wms-storage",
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
    resetAssistantStore()
    resetBoundingBoxStore()
    resetCpuStore()
    resetDataStore()
    resetExportStore()
    resetFileStore()
    resetGlobalStore()
    resetGpuStore()
    resetModelStore()
    resetNameStore()
    resetResourcesStore()
    resetVrtStore()
    resetWmsStore()

    storeKeys.forEach((key) => {
      localStorage.removeItem(key)
    })

    if (onReset) {
      onReset()
    }

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
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <History aria-hidden="true" />
              Konfiguration gefunden
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Möchtest du sie fortsetzen oder eine neue erstellen?
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
