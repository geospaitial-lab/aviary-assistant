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

import { type AggregationSource } from "@/components/assistant/aggregation/store"
import { useAggregationStore } from "@/components/assistant/aggregation/store"
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
import { type PostprocessingFormSchema } from "@/components/assistant/postprocessing/schema"
import { usePostprocessingStore } from "@/components/assistant/postprocessing/store"

function indent(level: number, text: string): string {
  return "  ".repeat(level) + text
}

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
    global: {
      formValues: GlobalFormSchema
    }
    dataSources: DataSource[]
  }
  postprocessing: {
    formValues: PostprocessingFormSchema
  }
  aggregation: {
    aggregationSources: AggregationSource[]
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
      global: {
        formValues: useGlobalStore.getState().formValues,
      },
      dataSources: useDataStore.getState().dataSources,
    },
    postprocessing: {
      formValues: usePostprocessingStore.getState().formValues,
    },
    aggregation: {
      aggregationSources: useAggregationStore.getState().aggregationSources,
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
    case "JPEG":
      return "image/jpeg"
    case "PNG":
      return "image/png"
    case "TIFF":
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

      gridConfigLines.push(indent(5, "geojson_path: 'area.geojson'"))
      gridConfigLines.push(indent(5, `epsg_code: ${epsgCode}`))
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

      const ixMin = Math.floor(txMin)
      const iyMin = Math.floor(tyMin)
      const ixMax = Math.ceil(txMax)
      const iyMax = Math.ceil(tyMax)

      gridConfigLines.push(indent(5, "bounding_box_coordinates:"))
      gridConfigLines.push(indent(6, `- ${ixMin}`))
      gridConfigLines.push(indent(6, `- ${iyMin}`))
      gridConfigLines.push(indent(6, `- ${ixMax}`))
      gridConfigLines.push(indent(6, `- ${iyMax}`))
      break
    }

    default:
      break
  }

  gridConfigLines.push(indent(5, `tile_size: ${tileSize}`))
  gridConfigLines.push(indent(5, `snap: ${SNAP}`))

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

      tileFetcherConfigLines.push(indent(7, "- name: 'WMSFetcher'"))
      tileFetcherConfigLines.push(indent(8, "config:"))
      tileFetcherConfigLines.push(indent(9, `url: '${url}'`))
      tileFetcherConfigLines.push(indent(9, `version: '${version}'`))
      tileFetcherConfigLines.push(indent(9, `layer: '${layer}'`))
      tileFetcherConfigLines.push(indent(9, `epsg_code: ${epsgCode}`))
      tileFetcherConfigLines.push(indent(9, `response_format: '${format}'`))
      tileFetcherConfigLines.push(indent(9, "channel_keys:"))
      mapWmsChannels(dataSource.channels).forEach((channel) =>
        tileFetcherConfigLines.push(indent(10, `- ${channel}`)),
      )
      tileFetcherConfigLines.push(indent(9, `tile_size: ${tileSize}`))
      tileFetcherConfigLines.push(
        indent(
          9,
          `ground_sampling_distance: ${parseFloat(groundSamplingDistance)}`,
        ),
      )
      if (style.trim().length > 0) {
        tileFetcherConfigLines.push(indent(9, `style: '${style}'`))
      } else {
        tileFetcherConfigLines.push(indent(9, "style: null"))
      }
      tileFetcherConfigLines.push(indent(9, `buffer_size: ${bufferSize}`))
    } else if (dataSource.type === "vrt") {
      const formValues = dataSource.formValues as VrtFormSchema
      const path = formValues.path
      const channelsComment = dataSource.channels.toUpperCase()
      const interpolation =
        dataSource.channels === "dom" ? "'nearest'" : "'bilinear'"

      tileFetcherConfigLines.push(indent(7, "- name: 'VRTFetcher'"))
      tileFetcherConfigLines.push(indent(8, "config:"))
      if (path.trim().length > 0) {
        tileFetcherConfigLines.push(indent(9, `path: '${path}'`))
      } else {
        tileFetcherConfigLines.push(
          indent(
            9,
            `path: '' # Trage hier den Pfad zu der .vrt-Datei (${channelsComment}) ein`,
          ),
        )
      }
      tileFetcherConfigLines.push(indent(9, "channel_keys:"))
      mapVrtChannels(dataSource.channels).forEach((channel) =>
        tileFetcherConfigLines.push(indent(10, `- ${channel}`)),
      )
      tileFetcherConfigLines.push(indent(9, `tile_size: ${tileSize}`))
      tileFetcherConfigLines.push(
        indent(
          9,
          `ground_sampling_distance: ${parseFloat(groundSamplingDistance)}`,
        ),
      )
      tileFetcherConfigLines.push(
        indent(9, `interpolation_mode: ${interpolation}`),
      )
      tileFetcherConfigLines.push(indent(9, `buffer_size: ${bufferSize}`))
    }
  })

  return tileFetcherConfigLines
}

function parseTileLoaderConfig(): string[] {
  const BATCH_SIZE = 1
  const MAX_NUM_THREADS = null
  const NUM_PREFETCHED_TILES = 0

  const tileLoaderConfigLines: string[] = []

  tileLoaderConfigLines.push(indent(5, `batch_size: ${BATCH_SIZE}`))
  tileLoaderConfigLines.push(indent(5, `max_num_threads: ${MAX_NUM_THREADS}`))
  tileLoaderConfigLines.push(
    indent(5, `num_prefetched_tiles: ${NUM_PREFETCHED_TILES}`),
  )

  return tileLoaderConfigLines
}

export function parseConfig(): string {
  const store = getStore()

  const configLines: string[] = []

  configLines.push("name: 'CompositePipeline'")
  configLines.push("config:")
  configLines.push(indent(1, "pipeline_configs:"))
  configLines.push(indent(2, "- name: 'TilePipeline'"))
  configLines.push(indent(3, "config:"))
  configLines.push(indent(4, "show_progress: true"))
  configLines.push("")

  configLines.push(indent(4, "grid_config:"))

  const gridConfigLines = parseGridConfig(store)
  configLines.push(...gridConfigLines)

  configLines.push("")
  configLines.push(indent(4, "tile_fetcher_config:"))
  configLines.push(indent(5, "name: 'CompositeFetcher'"))
  configLines.push(indent(5, "config:"))
  configLines.push(indent(6, "tile_fetcher_configs:"))

  const tileFetcherConfigLines = parseTileFetcherConfig(store)
  configLines.push(...tileFetcherConfigLines)

  configLines.push("")
  configLines.push(indent(4, "tile_loader_config:"))

  const tileLoaderConfigLines = parseTileLoaderConfig()
  configLines.push(...tileLoaderConfigLines)

  configLines.push("")
  configLines.push(indent(4, "tiles_processor_config:"))
  configLines.push(indent(5, "name: 'SequentialCompositeProcessor'"))
  configLines.push(indent(5, "config:"))
  configLines.push(indent(6, "tiles_processor_configs:"))
  configLines.push(indent(7, "TODO"))

  configLines.push("")
  configLines.push(indent(2, "- name: 'VectorPipeline'"))
  configLines.push(indent(3, "config:"))
  configLines.push(indent(4, "vector_loader_config:"))
  configLines.push(indent(5, "TODO"))

  configLines.push("")
  configLines.push(indent(4, "vector_processor_config:"))
  configLines.push(indent(5, "TODO"))

  return configLines.join("\n")
}
