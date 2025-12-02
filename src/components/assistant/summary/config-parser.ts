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
      return 250
    case "0.2":
      return 500
    case "0.5":
      return 1250
    default:
      return 500
  }
}

function mapGroundSamplingDistanceToBufferSize(
  groundSamplingDistance: string,
): number {
  switch (groundSamplingDistance) {
    case "0.1":
      return 52
    case "0.2":
      return 104
    case "0.5":
      return 260
    default:
      return 105
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
      // return ["'r'", "'g'", "'b'", "'nir'"]
      return ["'r'", "'g'", "'b'", "null"]
    case "dom":
      return ["'dsm'"]
    default:
      return ["'r'", "'g'", "'b'"]
  }
}

function parseGlobalConfig(store: Store): string[] {
  const globalConfigLines: string[] = []

  globalConfigLines.push(
    indent(0, "# Trage hier deine Hardware ein ('cpu' oder 'gpu')"),
  )
  globalConfigLines.push(indent(0, "device: &device 'cpu'"))
  globalConfigLines.push(indent(0, ""))

  const dirPath = store.export.formValues?.dirPath?.trim() || ""

  const hasEmptyVrtPath = store.data.dataSources.some((ds) => {
    if (ds.type !== "vrt") return false
    const formValues = ds.formValues as VrtFormSchema | null
    const p = formValues?.path?.trim() || ""
    return p.length === 0
  })

  const needsGeoJsonPath =
    store.area.activeTab === "name" || store.area.activeTab === "file"

  const emptyAggSources = (store.aggregation.aggregationSources || []).filter(
    (as) => {
      const path = (as.formValues?.path || "").trim()
      return path.length === 0
    },
  )

  const anchorsNeeded =
    dirPath.length === 0 ||
    hasEmptyVrtPath ||
    needsGeoJsonPath ||
    emptyAggSources.length > 0

  if (anchorsNeeded) {
    globalConfigLines.push(indent(0, "# Trage hier deine Pfade ein"))

    if (needsGeoJsonPath) {
      globalConfigLines.push(
        indent(0, `geojson_path: &geojson_path '/pfad/zu/area.geojson'`),
      )
    }

    if (hasEmptyVrtPath) {
      globalConfigLines.push(
        indent(
          0,
          `data_source_path: &data_source_path '/pfad/zu/datenquelle.vrt'`,
        ),
      )
    }

    if (emptyAggSources.length > 0) {
      emptyAggSources.forEach((_, idx) => {
        globalConfigLines.push(
          indent(
            0,
            `aggregation_source_path_${idx + 1}: &aggregation_source_path_${idx + 1} '/pfad/zu/aggregationsquelle_${idx + 1}.gpkg'`,
          ),
        )
      })
    }

    if (dirPath.length === 0) {
      globalConfigLines.push(
        indent(
          0,
          `output_dir_path: &output_dir_path '/pfad/zu/ausgabeverzeichnis'`,
        ),
      )
    }

    globalConfigLines.push(indent(0, ""))
  }

  return globalConfigLines
}

function parseGridConfig(store: Store): string[] {
  const SNAP = true

  const activeTab = store.area.activeTab
  const tileSize = mapGroundSamplingDistanceToTileSize(
    store.data.global.formValues.groundSamplingDistance,
  )

  const gridConfigLines: string[] = []

  switch (activeTab) {
    case "name": {
      const epsgCode = store.data.global.formValues.epsgCode

      gridConfigLines.push(indent(5, "geojson_path: *geojson_path"))
      gridConfigLines.push(indent(5, `epsg_code: ${epsgCode}`))
      break
    }
    case "file": {
      const epsgCode = store.data.global.formValues.epsgCode

      gridConfigLines.push(indent(5, "geojson_path: *geojson_path"))
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

  const dirPath = (store.export.formValues?.dirPath || "").trim()
  if (dirPath.length > 0) {
    gridConfigLines.push(
      indent(
        5,
        "ignore_json_path: !path_join ['" +
          dirPath +
          "', 'processed_grid.json']",
      ),
    )
  } else {
    gridConfigLines.push(
      indent(
        5,
        "ignore_json_path: !path_join [*output_dir_path, 'processed_grid.json']",
      ),
    )
  }
  gridConfigLines.push(indent(5, "strict_ignore_json_path: false"))
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

      tileFetcherConfigLines.push(indent(7, "- package: 'aviary'"))
      tileFetcherConfigLines.push(indent(8, "name: 'WMSFetcher'"))
      tileFetcherConfigLines.push(indent(8, "config:"))
      tileFetcherConfigLines.push(indent(9, `url: '${url}'`))
      tileFetcherConfigLines.push(indent(9, `version: '${version}'`))
      tileFetcherConfigLines.push(indent(9, `layer: '${layer}'`))
      tileFetcherConfigLines.push(indent(9, `epsg_code: ${epsgCode}`))
      tileFetcherConfigLines.push(indent(9, `response_format: '${format}'`))
      tileFetcherConfigLines.push(indent(9, "channel_names:"))
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
      const INTERPOLATION_MODE = "'bilinear'"

      const formValues = dataSource.formValues as VrtFormSchema
      const path = formValues.path

      tileFetcherConfigLines.push(indent(7, "- package: 'aviary'"))
      tileFetcherConfigLines.push(indent(8, "name: 'VRTFetcher'"))
      tileFetcherConfigLines.push(indent(8, "config:"))
      if (path.trim().length > 0) {
        tileFetcherConfigLines.push(indent(9, `path: '${path}'`))
      } else {
        tileFetcherConfigLines.push(indent(9, `path: *data_source_path`))
      }
      tileFetcherConfigLines.push(indent(9, "channel_names:"))
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
        indent(9, `interpolation_mode: ${INTERPOLATION_MODE}`),
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

function parseTilesProcessorConfig(): string[] {
  const tilesProcessorConfigLines: string[] = []

  tilesProcessorConfigLines.push(indent(7, "- package: 'aviary_models'"))
  tilesProcessorConfigLines.push(indent(8, "name: 'SursentiaPreprocessor'"))
  tilesProcessorConfigLines.push(indent(8, "config:"))
  tilesProcessorConfigLines.push(indent(9, "r_channel_name: 'r'"))
  tilesProcessorConfigLines.push(indent(9, "g_channel_name: 'g'"))
  tilesProcessorConfigLines.push(indent(9, "b_channel_name: 'b'"))

  tilesProcessorConfigLines.push(indent(7, "- package: 'aviary_models'"))
  tilesProcessorConfigLines.push(indent(8, "name: 'Sursentia'"))
  tilesProcessorConfigLines.push(indent(8, "config:"))

  const store = getStore()
  const { model1, model2 } = store.model.formValues

  tilesProcessorConfigLines.push(indent(9, "r_channel_name: 'r'"))
  tilesProcessorConfigLines.push(indent(9, "g_channel_name: 'g'"))
  tilesProcessorConfigLines.push(indent(9, "b_channel_name: 'b'"))
  tilesProcessorConfigLines.push(
    indent(
      9,
      `landcover_channel_name: ${model1 ? "'sursentia_landcover'" : "null"}`,
    ),
  )
  tilesProcessorConfigLines.push(
    indent(9, `solar_channel_name: ${model2 ? "'sursentia_solar'" : "null"}`),
  )
  tilesProcessorConfigLines.push(indent(9, "batch_size: 1"))
  tilesProcessorConfigLines.push(indent(9, "version: '1.0'"))
  tilesProcessorConfigLines.push(indent(9, "device: *device"))
  tilesProcessorConfigLines.push(
    indent(9, "cache_dir_path: !path_join [*output_dir_path, 'cache']"),
  )

  const epsgCode = store.data.global.formValues.epsgCode
  const dirPath = store.export.formValues.dirPath

  const maybeAddVectorProcessors = (channelKey: string) => {
    const backgroundValue = channelKey === "sursentia_solar" ? 0 : "null"
    tilesProcessorConfigLines.push(indent(7, "- package: 'aviary'"))
    tilesProcessorConfigLines.push(indent(8, "name: 'VectorizeProcessor'"))
    tilesProcessorConfigLines.push(indent(8, "config:"))
    tilesProcessorConfigLines.push(indent(9, `channel_name: '${channelKey}'`))
    tilesProcessorConfigLines.push(indent(9, "field: 'Klasse'"))
    tilesProcessorConfigLines.push(
      indent(9, `background_value: ${backgroundValue}`),
    )

    tilesProcessorConfigLines.push(indent(7, "- package: 'aviary'"))
    tilesProcessorConfigLines.push(indent(8, "name: 'VectorExporter'"))
    tilesProcessorConfigLines.push(indent(8, "config:"))
    tilesProcessorConfigLines.push(indent(9, `channel_name: '${channelKey}'`))
    tilesProcessorConfigLines.push(indent(9, `epsg_code: ${epsgCode}`))
    const gpkgName = `${channelKey}.gpkg`
    if (dirPath && dirPath.trim().length > 0) {
      tilesProcessorConfigLines.push(
        indent(9, "path: !path_join ['" + dirPath + "', '" + gpkgName + "']"),
      )
    } else {
      tilesProcessorConfigLines.push(
        indent(9, "path: !path_join [*output_dir_path, '" + gpkgName + "']"),
      )
    }
  }

  if (model1) {
    maybeAddVectorProcessors("sursentia_landcover")
  }

  if (model2) {
    maybeAddVectorProcessors("sursentia_solar")
  }

  tilesProcessorConfigLines.push(indent(7, "- package: 'aviary'"))
  tilesProcessorConfigLines.push(indent(8, "name: 'GridExporter'"))
  tilesProcessorConfigLines.push(indent(8, "config:"))
  if (dirPath && dirPath.trim().length > 0) {
    tilesProcessorConfigLines.push(
      indent(9, "path: !path_join ['" + dirPath + "', 'processed_grid.json']"),
    )
  } else {
    tilesProcessorConfigLines.push(
      indent(9, "path: !path_join [*output_dir_path, 'processed_grid.json']"),
    )
  }

  return tilesProcessorConfigLines
}

function parseVectorLoaderConfig(store: Store): string[] {
  const lines: string[] = []

  const { model1, model2 } = store.model.formValues
  const dirPath = (store.export.formValues?.dirPath || "").trim()
  const epsgCode = store.data.global.formValues.epsgCode

  const activeTab = store.area.activeTab
  if (activeTab === "name" || activeTab === "file") {
    lines.push(indent(7, "- package: 'aviary'"))
    lines.push(indent(8, "name: 'GeoJSONLoader'"))
    lines.push(indent(8, "config:"))
    lines.push(indent(9, "path: *geojson_path"))
    lines.push(indent(9, `epsg_code: ${epsgCode}`))
    lines.push(indent(9, "layer_name: 'area'"))
  } else if (activeTab === "bounding-box") {
    const xMin = store.area.boundingBox.formValues?.xMin as number
    const yMin = store.area.boundingBox.formValues?.yMin as number
    const xMax = store.area.boundingBox.formValues?.xMax as number
    const yMax = store.area.boundingBox.formValues?.yMax as number
    const sourceEpsgCode = store.area.boundingBox.formValues?.epsgCode as string
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

    lines.push(indent(7, "- package: 'aviary'"))
    lines.push(indent(8, "name: 'BoundingBoxLoader'"))
    lines.push(indent(8, "config:"))
    lines.push(indent(9, "bounding_box_coordinates:"))
    lines.push(indent(10, `- ${ixMin}`))
    lines.push(indent(10, `- ${iyMin}`))
    lines.push(indent(10, `- ${ixMax}`))
    lines.push(indent(10, `- ${iyMax}`))
    lines.push(indent(9, `epsg_code: ${epsgCode}`))
    lines.push(indent(9, "layer_name: 'area'"))
  }

  const pushGpkgLoader = (pathLine: string, layerName: string) => {
    lines.push(indent(7, "- package: 'aviary'"))
    lines.push(indent(8, "name: 'GPKGLoader'"))
    lines.push(indent(8, "config:"))
    lines.push(indent(9, pathLine))
    lines.push(indent(9, `epsg_code: ${epsgCode}`))
    lines.push(indent(9, `layer_name: '${layerName}'`))
  }

  if (dirPath.length > 0) {
    if (model1) {
      pushGpkgLoader(
        "path: !path_join ['" + dirPath + "', 'sursentia_landcover.gpkg']",
        "sursentia_landcover",
      )
    }
    if (model2) {
      pushGpkgLoader(
        "path: !path_join ['" + dirPath + "', 'sursentia_solar.gpkg']",
        "sursentia_solar",
      )
    }
  } else {
    if (model1) {
      pushGpkgLoader(
        "path: !path_join [*output_dir_path, 'sursentia_landcover.gpkg']",
        "sursentia_landcover",
      )
    }
    if (model2) {
      pushGpkgLoader(
        "path: !path_join [*output_dir_path, 'sursentia_solar.gpkg']",
        "sursentia_solar",
      )
    }
  }

  const sources = store.aggregation.aggregationSources || []
  let emptyIdx = 0
  sources.forEach((src) => {
    const name = src.formValues?.name?.trim() || ""
    const path = src.formValues?.path?.trim() || ""
    if (name.length === 0 && path.length === 0) return

    const stripGpkg = (s: string) => s.replace(/\.gpkg$/i, "")
    let layerName: string
    if (path.length > 0) {
      const base = path.split(/[/\\\\]/).pop() || name
      layerName = stripGpkg(base)
    } else {
      layerName = stripGpkg(name)
    }

    if (path.length > 0) {
      pushGpkgLoader(`path: '${path}'`, layerName)
    } else {
      emptyIdx += 1
      pushGpkgLoader(`path: *aggregation_source_path_${emptyIdx}`, layerName)
    }
  })

  return lines
}

export function parseConfig(): string {
  const store = getStore()

  const configLines: string[] = []

  const globalConfigLines = parseGlobalConfig(store)
  configLines.push(...globalConfigLines)

  configLines.push("package: 'aviary'")
  configLines.push("name: 'CompositePipeline'")
  configLines.push("config:")
  configLines.push(indent(1, "pipeline_configs:"))
  configLines.push(indent(2, "- package: 'aviary'"))
  configLines.push(indent(3, "name: 'TilePipeline'"))
  configLines.push(indent(3, "config:"))
  configLines.push(indent(4, "show_progress: true"))
  configLines.push("")

  configLines.push(indent(4, "grid_config:"))

  const gridConfigLines = parseGridConfig(store)
  configLines.push(...gridConfigLines)

  configLines.push("")
  configLines.push(indent(4, "tile_fetcher_config:"))
  configLines.push(indent(5, "package: 'aviary'"))
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
  configLines.push(indent(5, "package: 'aviary'"))
  configLines.push(indent(5, "name: 'SequentialCompositeProcessor'"))
  configLines.push(indent(5, "config:"))
  configLines.push(indent(6, "tiles_processor_configs:"))

  const tilesProcessorConfigLines = parseTilesProcessorConfig()
  configLines.push(...tilesProcessorConfigLines)

  configLines.push("")
  configLines.push(indent(2, "- package: 'aviary'"))
  configLines.push(indent(3, "name: 'VectorPipeline'"))
  configLines.push(indent(3, "config:"))
  configLines.push(indent(4, "vector_loader_config:"))
  configLines.push(indent(5, "package: 'aviary'"))
  configLines.push(indent(5, "name: 'CompositeVectorLoader'"))
  configLines.push(indent(5, "config:"))
  configLines.push(indent(6, "vector_loader_configs:"))

  const vectorLoaderLines = parseVectorLoaderConfig(store)
  configLines.push(...vectorLoaderLines)

  configLines.push("")
  configLines.push(indent(4, "vector_processor_config:"))
  configLines.push(indent(5, "TODO"))

  return configLines.join("\n")
}
