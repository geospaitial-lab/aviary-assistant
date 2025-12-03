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

import { useAggregationStore } from "@/components/assistant/aggregation/store"
import { useModelStore } from "@/components/assistant/model/store"
import { type DirectoryNode, DirectoryTree } from "@/components/directory-tree"

export function OutputDirectoryTree() {
  const { model1, model2 } = useModelStore((state) => state.formValues)

  const outputFolderName = "output_dir"

  const aggregationSources = useAggregationStore(
    (state) => state.aggregationSources,
  )

  const hasAggregationSources = React.useMemo(() => {
    const sources = aggregationSources || []
    return sources.length > 0
  }, [aggregationSources])

  const directoryItems = React.useMemo<DirectoryNode[]>(() => {
    const children: DirectoryNode[] = []

    children.push({ name: "cache", type: "folder" })

    children.push({ name: "pipeline.log", type: "file" })
    children.push({ name: "processed_grid.json", type: "file" })

    const lcFiles: string[] = []
    const solarFiles: string[] = []

    if (model1) {
      lcFiles.push("sursentia_landcover.gpkg")
      lcFiles.push("sursentia_landcover_postprocessed.gpkg")
    }
    if (model2) {
      solarFiles.push("sursentia_solar.gpkg")
      solarFiles.push("sursentia_solar_postprocessed.gpkg")
    }

    const stripGpkg = (s: string) => s.replace(/\.gpkg$/i, "")

    const aggregationLayers = (aggregationSources || [])
      .map((aggregationSource) => {
        const name = aggregationSource.formValues?.name?.trim() || ""
        if (name.length === 0) return null
        return stripGpkg(name)
      })
      .filter((v): v is string => !!v && v.length > 0)

    if (aggregationLayers.length > 0) {
      if (model1) {
        aggregationLayers.forEach((aggregationLayer) => {
          lcFiles.push(
            `sursentia_landcover_aggregated_${aggregationLayer}.gpkg`,
          )
        })
      }
      if (model2) {
        aggregationLayers.forEach((aggregationLayer) => {
          solarFiles.push(`sursentia_solar_aggregated_${aggregationLayer}.gpkg`)
        })
      }
    }

    lcFiles.sort((a, b) => a.localeCompare(b))
    solarFiles.sort((a, b) => a.localeCompare(b))

    lcFiles.forEach((name) => children.push({ name, type: "file" }))
    solarFiles.forEach((name) => children.push({ name, type: "file" }))

    return [
      {
        name: outputFolderName,
        type: "folder",
        children,
      },
    ]
  }, [model1, model2, outputFolderName, aggregationSources])

  return (
    <div>
      <p className="text-pretty my-8">
        Am Ende findest du die Ergebnisse unserer KI
        {hasAggregationSources ? " und die aggregierten Flächen" : ""} in deinem
        Ausgabeverzeichnis.
      </p>

      <div className="rounded-md bg-background dark:bg-input/30 border dark:border-input p-4 overflow-x-auto">
        <DirectoryTree
          items={directoryItems}
          ariaLabel="Ausgabe-Verzeichnisstruktur"
        />
      </div>
    </div>
  )
}
