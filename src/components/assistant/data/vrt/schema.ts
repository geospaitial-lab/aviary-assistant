import { z } from "zod"

export const vrtFormSchema = z.object({
  path: z.string(),
  groundSamplingDistance: z.number(),
  channels: z.enum(["rgb", "cir", "nir", "rgbi", "dom"]),
})

export type vrtFormSchema = z.infer<typeof vrtFormSchema>
