import { z } from "zod"

export const exportFormSchema = z.object({
  dirPath: z.string(),
})

export type ExportFormSchema = z.infer<typeof exportFormSchema>
