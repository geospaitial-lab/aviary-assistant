import { z } from "zod"

const ERROR_NUMBER = "Muss eine positive Zahl (0 bis 1) sein"

export const vrtFormSchema = z.object({
  path: z.string(),
  channels: z.enum(["rgb", "cir", "nir", "rgbi", "dom"]),
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
})

export type VrtFormSchema = z.infer<typeof vrtFormSchema>
