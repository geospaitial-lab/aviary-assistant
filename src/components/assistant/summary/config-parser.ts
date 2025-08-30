import { type BoundingBoxFormSchema } from "@/components/assistant/area/bounding-box/schema"
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
    formValues: ModelFormSchema | null
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
      formValues: GlobalFormSchema | null
    }
  }
  resources: {
    activeTab: string
    cpu: {
      formValues: CpuFormSchema | null
    }
    gpu: {
      formValues: GpuFormSchema | null
    }
  }
  export: {
    formValues: ExportFormSchema | null
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
  groundSamplingDistance?: string,
): number {
  switch (groundSamplingDistance) {
    case "0.1":
      return 96
    case "0.2":
      return 192
    case "0.5":
      return 480
    case "1.0":
      return 960
    default:
      return 192
  }
}

function parseAreaConfig(store: Store): string[] {
  const SNAP = true

  const activeTab = store.area.activeTab
  const tileSize = mapGroundSamplingDistanceToTileSize(
    store.data.global.formValues?.groundSamplingDistance,
  )

  const areaConfigLines: string[] = []

  switch (activeTab) {
    case "name":
    case "file": {
      const epsgCode = store.data.global.formValues?.epsgCode

      areaConfigLines.push(`  geojson_path: 'area.geojson'`)
      areaConfigLines.push(`  epsg_code: ${epsgCode}`)
      break
    }

    case "bounding-box": {
      const xMin = store.area.boundingBox.formValues?.xMin
      const yMin = store.area.boundingBox.formValues?.yMin
      const xMax = store.area.boundingBox.formValues?.xMax
      const yMax = store.area.boundingBox.formValues?.yMax

      if (xMin && yMin && xMax && yMax) {
        areaConfigLines.push("  bounding_box_coordinates:")
        areaConfigLines.push(`    - ${xMin}`)
        areaConfigLines.push(`    - ${yMin}`)
        areaConfigLines.push(`    - ${xMax}`)
        areaConfigLines.push(`    - ${yMax}`)
      }
      break
    }

    default:
      break
  }

  areaConfigLines.push(`  tile_size: ${tileSize}`)
  areaConfigLines.push(`  snap: ${SNAP}`)

  return areaConfigLines
}

export function parseConfig(): string {
  const store = getStore()

  const configLines: string[] = []

  configLines.push("grid_config:")

  const areaConfigLines = parseAreaConfig(store)
  configLines.push(...areaConfigLines)

  configLines.push("")
  configLines.push("tiles_processor_config:")
  configLines.push("  name: 'SequentialCompositeProcessor'")
  configLines.push("  config:")
  configLines.push("    tiles_processor_configs:")

  return configLines.join("\n")
}
