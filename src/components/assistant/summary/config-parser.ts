import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { useAreaStore } from "@/components/assistant/area/store"

function parseAreaConfig(): string {
  const TILE_SIZE = 128
  const SNAP = true

  const activeTab = useAreaStore.getState().activeTab

  let areaConfig = "grid_config:\n"

  switch (activeTab) {
    case "name":
    case "file": {
      areaConfig += `  geojson_path: "area.geojson"\n`
      break
    }

    case "bounding-box": {
      const boundingBoxState = useBoundingBoxStore.getState()
      const formValues = boundingBoxState.formValues

      if (formValues) {
        areaConfig += "  bounding_box_coordinates:\n"
        areaConfig += `    - ${formValues.xMin}\n`
        areaConfig += `    - ${formValues.yMin}\n`
        areaConfig += `    - ${formValues.xMax}\n`
        areaConfig += `    - ${formValues.yMax}\n`
      }
      break
    }

    default:
      break
  }

  areaConfig += `  tile_size: ${TILE_SIZE}\n`
  areaConfig += `  snap: ${SNAP}\n`

  return areaConfig
}

export function parseConfig(): string {
  const areaConfig = parseAreaConfig()

  let config = areaConfig

  return config
}
