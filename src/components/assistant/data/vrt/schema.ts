import { z } from "zod"

export const vrtFormSchema = z.object({
  path: z.string(),
})

export type VrtFormSchema = z.infer<typeof vrtFormSchema>
