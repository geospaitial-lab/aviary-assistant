import { z } from "zod"

const ERROR_NUMBER = "Muss eine positive Zahl zwischen 0 und 1 sein"

export const vrtFormSchema = z.object({
  path: z.string(),
  groundSamplingDistance: z.preprocess(
    (value) => {
      if (value === "") return undefined
      return typeof value === "string" ? value.replace(/,/g, ".") : value
    },
    z.coerce
      .number({
        invalid_type_error: ERROR_NUMBER,
      })
      .gt(0, ERROR_NUMBER)
      .max(1, ERROR_NUMBER),
  ),
  channels: z.enum(["rgb", "cir", "nir", "rgbi", "dom"]),
})

export type VrtFormSchema = z.infer<typeof vrtFormSchema>
