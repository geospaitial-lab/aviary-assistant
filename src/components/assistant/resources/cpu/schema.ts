import { z } from "zod"

export const cpuFormSchema = z.object({
  ram: z.number().min(0).max(3),
})

export type CpuFormSchema = z.infer<typeof cpuFormSchema>
