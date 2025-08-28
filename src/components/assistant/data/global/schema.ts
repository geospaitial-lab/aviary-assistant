import { z } from "zod"

export const globalFormSchema = z.object({
  epsgCode: z.enum(["25832", "25833"]),
  groundSamplingDistance: z.enum(["0.1", "0.2", "0.5", "1.0"]),
})

export type GlobalFormSchema = z.infer<typeof globalFormSchema>
