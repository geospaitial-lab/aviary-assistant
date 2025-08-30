import { type BoundingBoxFormSchema } from "@/components/assistant/area/bounding-box/schema"
import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { type FileFormSchema } from "@/components/assistant/area/file/schema"
import { useFileStore } from "@/components/assistant/area/file/store"
import { type NameFormSchema } from "@/components/assistant/area/name/schema"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
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

function parseAreaConfig(): string[] {
  const TILE_SIZE = 128
  const SNAP = true

  const activeTab = useAreaStore.getState().activeTab

  const areaConfigLines: string[] = []

  switch (activeTab) {
    case "name":
    case "file": {
      areaConfigLines.push(`  geojson_path: 'area.geojson'`)
      break
    }

    case "bounding-box": {
      const boundingBoxState = useBoundingBoxStore.getState()
      const formValues = boundingBoxState.formValues

      if (formValues) {
        areaConfigLines.push("  bounding_box_coordinates:")
        areaConfigLines.push(`    - ${formValues.xMin}`)
        areaConfigLines.push(`    - ${formValues.yMin}`)
        areaConfigLines.push(`    - ${formValues.xMax}`)
        areaConfigLines.push(`    - ${formValues.yMax}`)
      }
      break
    }

    default:
      break
  }

  areaConfigLines.push(`  tile_size: ${TILE_SIZE}`)
  areaConfigLines.push(`  snap: ${SNAP}`)

  return areaConfigLines
}

export function parseConfig(): string {
  const configLines: string[] = []

  configLines.push("grid_config:")

  const areaConfigLines = parseAreaConfig()
  configLines.push(...areaConfigLines)

  configLines.push("")
  configLines.push("tiles_processor_config:")
  configLines.push("  name: 'SequentialCompositeProcessor'")
  configLines.push("  config:")
  configLines.push("    tiles_processor_configs:")

  return configLines.join("\n")
}
