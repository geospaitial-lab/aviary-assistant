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
import proj4 from "proj4"

import {
  type BoundingBoxFormSchema,
  getProjectionString,
} from "@/components/assistant/area/bounding-box/schema"
import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { type FileFormSchema } from "@/components/assistant/area/file/schema"
import { useFileStore } from "@/components/assistant/area/file/store"
import { type NameFormSchema } from "@/components/assistant/area/name/schema"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { type GlobalFormSchema } from "@/components/assistant/data/global/schema"
import { useGlobalStore } from "@/components/assistant/data/global/store"
import { useDataStore } from "@/components/assistant/data/store"
import { type DataSource } from "@/components/assistant/data/store"
import { type VrtFormSchema } from "@/components/assistant/data/vrt/schema"
import { type WmsFormSchema } from "@/components/assistant/data/wms/schema"
import { type ExportFormSchema } from "@/components/assistant/export/schema"
import { useExportStore } from "@/components/assistant/export/store"
import { type ModelFormSchema } from "@/components/assistant/model/schema"
import { useModelStore } from "@/components/assistant/model/store"
import { type CpuFormSchema } from "@/components/assistant/resources/cpu/schema"
import { useCpuStore } from "@/components/assistant/resources/cpu/store"
import { type GpuFormSchema } from "@/components/assistant/resources/gpu/schema"
import { useGpuStore } from "@/components/assistant/resources/gpu/store"
import { useResourcesStore } from "@/components/assistant/resources/store"

interface Store {
  model: {
    formValues: ModelFormSchema
  }
  area: {
    activeTab: string
    boundingBox: {
      formValues: BoundingBoxFormSchema | null
    }
    file: {
      formValues: FileFormSchema | null
    }
    name: {
      formValues: NameFormSchema | null
    }
  }
  data: {
    dataSources: DataSource[]
    global: {
      formValues: GlobalFormSchema
    }
  }
  resources: {
    activeTab: string
    cpu: {
      formValues: CpuFormSchema
    }
    gpu: {
      formValues: GpuFormSchema
    }
  }
  export: {
    formValues: ExportFormSchema
  }
}

export function getStore(): Store {
  return {
    model: {
      formValues: useModelStore.getState().formValues,
    },
    area: {
      activeTab: useAreaStore.getState().activeTab,
      boundingBox: {
        formValues: useBoundingBoxStore.getState().formValues,
      },
      file: {
        formValues: useFileStore.getState().formValues,
      },
      name: {
        formValues: useNameStore.getState().formValues,
      },
    },
    data: {
      dataSources: useDataStore.getState().dataSources,
      global: {
        formValues: useGlobalStore.getState().formValues,
      },
    },
    resources: {
      activeTab: useResourcesStore.getState().activeTab,
      cpu: {
        formValues: useCpuStore.getState().formValues,
      },
      gpu: {
        formValues: useGpuStore.getState().formValues,
      },
    },
    export: {
      formValues: useExportStore.getState().formValues,
    },
  }
}

function mapGroundSamplingDistanceToTileSize(
  groundSamplingDistance: string,
): number {
  switch (groundSamplingDistance) {
    case "0.1":
      return 64
    case "0.2":
      return 128
    case "0.5":
      return 320
    case "1.0":
      return 640
    default:
      return 128
  }
}

function mapGroundSamplingDistanceToBufferSize(
  groundSamplingDistance: string,
): number {
  switch (groundSamplingDistance) {
    case "0.1":
      return 16
    case "0.2":
      return 32
    case "0.5":
      return 80
    case "1.0":
      return 160
    default:
      return 32
  }
}

function mapWmsFormatToMimeType(format: string | undefined): string {
  switch (format) {
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".tiff":
      return "image/tiff"
    default:
      return "image/png"
  }
}

function mapWmsChannels(channels: string): string[] {
  switch (channels) {
    case "rgb":
      return ["'r'", "'g'", "'b'"]
    case "cir":
      return ["'nir'", "'r'", "'g'"]
    case "nir":
      return ["'nir'", "null", "null"]
    case "dom":
      return ["'dsm'", "null", "null"]
    default:
      return ["'r'", "'g'", "'b'"]
  }
}

function mapVrtChannels(channels: string): string[] {
  switch (channels) {
    case "rgb":
      return ["'r'", "'g'", "'b'"]
    case "cir":
      return ["'nir'", "'r'", "'g'"]
    case "nir":
      return ["'nir'"]
    case "rgbi":
      return ["'r'", "'g'", "'b'", "'nir'"]
    case "dom":
      return ["'dsm'"]
    default:
      return ["'r'", "'g'", "'b'"]
  }
}

function mapCpuRamToBatchSize(cpuRam: number): number {
  switch (cpuRam) {
    case 0:
      return 1
    case 1:
      return 2
    case 2:
      return 4
    case 3:
      return 8
    default:
      return 2
  }
}

function mapGpuVramToBatchSize(gpuVram: number): number {
  switch (gpuVram) {
    case 0:
      return 1
    case 1:
      return 2
    case 2:
      return 4
    case 3:
      return 8
    default:
      return 2
  }
}

function parseGridConfig(store: Store): string[] {
  const SNAP = true

  const activeTab = store.area.activeTab
  const tileSize = mapGroundSamplingDistanceToTileSize(
    store.data.global.formValues.groundSamplingDistance,
  )

  const gridConfigLines: string[] = []

  switch (activeTab) {
    case "name":
    case "file": {
      const epsgCode = store.data.global.formValues.epsgCode

      gridConfigLines.push(`  geojson_path: 'area.geojson'`)
      gridConfigLines.push(`  epsg_code: ${epsgCode}`)
      break
    }

    case "bounding-box": {
      const xMin = store.area.boundingBox.formValues?.xMin as number
      const yMin = store.area.boundingBox.formValues?.yMin as number
      const xMax = store.area.boundingBox.formValues?.xMax as number
      const yMax = store.area.boundingBox.formValues?.yMax as number
      const sourceEpsgCode = store.area.boundingBox.formValues
        ?.epsgCode as string
      const targetEpsgCode = store.data.global.formValues.epsgCode

      const fromProjection = getProjectionString(sourceEpsgCode)
      const toProjection = getProjectionString(targetEpsgCode)

      const needTransform = fromProjection !== toProjection

      const [txMin, tyMin] = needTransform
        ? proj4(fromProjection, toProjection, [xMin, yMin])
        : [xMin, yMin]
      const [txMax, tyMax] = needTransform
        ? proj4(fromProjection, toProjection, [xMax, yMax])
        : [xMax, yMax]

      gridConfigLines.push("  bounding_box_coordinates:")
      gridConfigLines.push(`    - ${txMin}`)
      gridConfigLines.push(`    - ${tyMin}`)
      gridConfigLines.push(`    - ${txMax}`)
      gridConfigLines.push(`    - ${tyMax}`)
      break
    }

    default:
      break
  }

  gridConfigLines.push(`  tile_size: ${tileSize}`)
  gridConfigLines.push(`  snap: ${SNAP}`)

  return gridConfigLines
}

function parseTileFetcherConfig(store: Store): string[] {
  const dataSources = store.data.dataSources
  const epsgCode = store.data.global.formValues.epsgCode
  const groundSamplingDistance =
    store.data.global.formValues.groundSamplingDistance
  const tileSize = mapGroundSamplingDistanceToTileSize(groundSamplingDistance)
  const bufferSize = mapGroundSamplingDistanceToBufferSize(
    groundSamplingDistance,
  )

  const tileFetcherConfigLines: string[] = []

  dataSources.forEach((dataSource) => {
    if (!dataSource.formValues) return

    if (dataSource.type === "wms") {
      const formValues = dataSource.formValues as WmsFormSchema
      const url = formValues.url
      const version = formValues.version
      const layer = formValues.layer
      const format = mapWmsFormatToMimeType(formValues.format)
      const style = formValues.style

      tileFetcherConfigLines.push("      - name: 'WMSFetcher'")
      tileFetcherConfigLines.push("        config:")
      tileFetcherConfigLines.push(`          url: '${url}'`)
      tileFetcherConfigLines.push(`          version: '${version}'`)
      tileFetcherConfigLines.push(`          layer: '${layer}'`)
      tileFetcherConfigLines.push(`          epsg_code: ${epsgCode}`)
      tileFetcherConfigLines.push(`          response_format: '${format}'`)
      tileFetcherConfigLines.push("          channel_keys:")
      mapWmsChannels(dataSource.channels).forEach((channel) =>
        tileFetcherConfigLines.push(`            - ${channel}`),
      )
      tileFetcherConfigLines.push(`          tile_size: ${tileSize}`)
      tileFetcherConfigLines.push(
        `          ground_sampling_distance: ${parseFloat(groundSamplingDistance)}`,
      )
      if (style.trim().length > 0) {
        tileFetcherConfigLines.push(`          style: '${style}'`)
      } else {
        tileFetcherConfigLines.push("          style: null")
      }
      tileFetcherConfigLines.push(`          buffer_size: ${bufferSize}`)
    } else if (dataSource.type === "vrt") {
      const formValues = dataSource.formValues as VrtFormSchema
      const path = formValues.path
      const channelsComment = dataSource.channels.toUpperCase()
      const interpolation =
        dataSource.channels === "dom" ? "nearest" : "bilinear"

      tileFetcherConfigLines.push("      - name: 'VRTFetcher'")
      tileFetcherConfigLines.push("        config:")
      if (path.trim().length > 0) {
        tileFetcherConfigLines.push(`          path: '${path}'`)
      } else {
        tileFetcherConfigLines.push(
          `          path: '' # Trage hier den Pfad zu der .vrt-Datei (${channelsComment}) ein`,
        )
      }
      tileFetcherConfigLines.push("          channel_keys:")
      mapVrtChannels(dataSource.channels).forEach((channel) =>
        tileFetcherConfigLines.push(`            - ${channel}`),
      )
      tileFetcherConfigLines.push(`          tile_size: ${tileSize}`)
      tileFetcherConfigLines.push(
        `          ground_sampling_distance: ${parseFloat(groundSamplingDistance)}`,
      )
      tileFetcherConfigLines.push(
        `          interpolation_mode: ${interpolation}`,
      )
      tileFetcherConfigLines.push(`          buffer_size: ${bufferSize}`)
    }
  })

  return tileFetcherConfigLines
}

function parseTileLoaderConfig(store: Store): string[] {
  const MAX_NUM_THREADS = null
  const NUM_PREFETCHED_TILES = 1

  const activeTab = store.resources.activeTab

  const tileLoaderConfigLines: string[] = []

  switch (activeTab) {
    case "cpu": {
      const batchSize = mapCpuRamToBatchSize(store.resources.cpu.formValues.ram)

      tileLoaderConfigLines.push(`  batch_size: ${batchSize}`)
      break
    }

    case "gpu": {
      const batchSize = mapGpuVramToBatchSize(
        store.resources.gpu.formValues.vram,
      )

      tileLoaderConfigLines.push(`  batch_size: ${batchSize}`)
      break
    }

    default:
      break
  }

  tileLoaderConfigLines.push(`  max_num_threads: ${MAX_NUM_THREADS}`)
  tileLoaderConfigLines.push(`  num_prefetched_tiles: ${NUM_PREFETCHED_TILES}`)

  return tileLoaderConfigLines
}

export function parseConfig(): string {
  const store = getStore()

  const configLines: string[] = []

  configLines.push("grid_config:")

  const gridConfigLines = parseGridConfig(store)
  configLines.push(...gridConfigLines)

  configLines.push("")
  configLines.push("tile_fetcher_config:")
  configLines.push("  name: 'CompositeFetcher'")
  configLines.push("  config:")
  configLines.push("    tile_fetcher_configs:")

  const tileFetcherConfigLines = parseTileFetcherConfig(store)
  configLines.push(...tileFetcherConfigLines)

  configLines.push("")
  configLines.push("tile_loader_config:")

  const tileLoaderConfigLines = parseTileLoaderConfig(store)
  configLines.push(...tileLoaderConfigLines)

  configLines.push("")
  configLines.push("tiles_processor_config:")
  configLines.push("  name: 'SequentialCompositeProcessor'")
  configLines.push("  config:")
  configLines.push("    tiles_processor_configs:")
  configLines.push("      TODO")

  return configLines.join("\n")
}
