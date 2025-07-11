import { z } from "zod"

export const gpuFormSchema = z.object({
  vram: z.number().min(0).max(3),
})

export type GpuFormSchema = z.infer<typeof gpuFormSchema>
