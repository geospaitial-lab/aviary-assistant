"use client"

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
import * as React from "react"

import { History } from "lucide-react"

import { useAggregationStore } from "@/components/assistant/aggregation/store"
import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { useGlobalStore } from "@/components/assistant/data/global/store"
import { useDataStore } from "@/components/assistant/data/store"
import { useExportStore } from "@/components/assistant/export/store"
import { useModelStore } from "@/components/assistant/model/store"
import { usePostprocessingStore } from "@/components/assistant/postprocessing/store"
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

  const resetAggregationStore = useAggregationStore((state) => state.reset)
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
  const resetPostprocessingStore = usePostprocessingStore(
    (state) => state.reset,
  )
  const resetResourcesStore = useResourcesStore((state) => state.reset)

  const storeKeys = [
    "aggregation-storage",
    "area-bounding-box-storage",
    "area-file-storage",
    "area-name-storage",
    "area-storage",
    "assistant-storage",
    "data-global-storage",
    "data-storage",
    "export-storage",
    "model-storage",
    "postprocessing-storage",
    "resources-cpu-storage",
    "resources-gpu-storage",
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
    resetAggregationStore()
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
    resetPostprocessingStore()
    resetResourcesStore()

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
