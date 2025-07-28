import { z } from "zod"

const ERROR_MODEL = "Mindestens ein Modell muss ausgewählt sein"

export const modelFormSchema = z
  .object({
    model1: z.boolean(),
    model2: z.boolean(),
    root: z.string().optional(),
  })
  .refine((data) => data.model1 || data.model2, {
    message: ERROR_MODEL,
    path: ["root"],
  })

export type ModelFormSchema = z.infer<typeof modelFormSchema>
