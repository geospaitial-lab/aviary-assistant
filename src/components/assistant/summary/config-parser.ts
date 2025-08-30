import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { useAreaStore } from "@/components/assistant/area/store"

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
