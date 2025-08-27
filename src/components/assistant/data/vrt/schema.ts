import { z } from "zod"

export const vrtFormSchema = z.object({
  path: z.string(),
  epsgCode: z.enum(["25832", "25833"]),
  channels: z.enum(["rgb", "cir", "nir", "rgbi", "dom"]),
  groundSamplingDistance: z.enum(["0.1", "0.2", "0.5", "1.0"]),
})

export type VrtFormSchema = z.infer<typeof vrtFormSchema>
