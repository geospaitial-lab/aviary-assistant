import { z } from "zod"

export const exportFormSchema = z.object({
  dirPath: z.string().optional(),
})

export type ExportFormSchema = z.infer<typeof exportFormSchema>
