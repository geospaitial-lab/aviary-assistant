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

import { CircleAlert } from "lucide-react"

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
import { Button } from "@/components/ui/button"

export function NewConfigButton() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

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

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleConfirmReset = () => {
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

    setIsDialogOpen(false)
  }

  const handleCancelReset = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button onClick={handleOpenDialog}>Neue Konfiguration</Button>

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
    </>
  )
}
