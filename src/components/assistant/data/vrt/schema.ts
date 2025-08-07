import { z } from "zod"

const ERROR_GROUND_SAMPLING_DISTANCE = "Muss eine positive Zahl (0 bis 1) sein"

export const vrtFormSchema = z.object({
  path: z.string(),
  epsgCode: z.enum(["25832", "25833"]),
  channels: z.enum(["rgb", "cir", "nir", "rgbi", "dom"]),
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

export type VrtFormSchema = z.infer<typeof vrtFormSchema>
