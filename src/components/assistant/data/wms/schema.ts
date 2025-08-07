import { z } from "zod"

const ERROR_GROUND_SAMPLING_DISTANCE = "Muss eine positive Zahl (0 bis 1) sein"
const ERROR_LAYER = "Muss ein gültiger Layer sein"
const ERROR_URL = "Muss eine gültige URL sein"

export const wmsFormSchema = z.object({
  url: z.string().min(1, ERROR_URL),
  version: z.enum(["1.1.1", "1.3.0"]),
  layer: z.string().min(1, ERROR_LAYER),
  format: z.enum([".jpeg", ".png", ".tiff"]),
  style: z.string(),
  epsgCode: z.enum(["25832", "25833"]),
  channels: z.enum(["rgb", "cir", "nir", "dom"]),
  groundSamplingDistance: z.preprocess(
    (value) => {
      if (value === "") return undefined
      return typeof value === "string" ? value.replace(/,/g, ".") : value
    },
    z.coerce
      .number({
        invalid_type_error: ERROR_GROUND_SAMPLING_DISTANCE,
      })
      .gt(0, ERROR_GROUND_SAMPLING_DISTANCE)
      .max(1, ERROR_GROUND_SAMPLING_DISTANCE),
  ),
})

export type WmsFormSchema = z.infer<typeof wmsFormSchema>
