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

  configLines.push("")
  configLines.push("tile_loader_config:")

  const tileLoaderConfigLines = parseTileLoaderConfig(store)
  configLines.push(...tileLoaderConfigLines)

  configLines.push("")
  configLines.push("tiles_processor_config:")
  configLines.push("  name: 'SequentialCompositeProcessor'")
  configLines.push("  config:")
  configLines.push("    tiles_processor_configs:")

  return configLines.join("\n")
}
