import { z } from "zod"

const ERROR_LAYER = "Muss ein gültiger Layer sein"
const ERROR_URL = "Muss eine gültige URL sein"

export const wmsFormSchema = z.object({
  url: z.string().min(1, ERROR_URL),
  version: z.enum(["1.1.1", "1.3.0"]),
  layer: z.string().min(1, ERROR_LAYER),
  format: z.enum([".jpeg", ".png", ".tiff"]),
  style: z.string(),
})

export type WmsFormSchema = z.infer<typeof wmsFormSchema>
