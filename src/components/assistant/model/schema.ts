import { z } from "zod"

const ERROR_MODEL = "Wähle mindestens ein Modell"

export const modelFormSchema = z
  .object({
    model1: z.boolean(),
    model2: z.boolean(),
  })
  .refine((data) => data.model1 || data.model2, {
    message: ERROR_MODEL,
  })

export type ModelFormSchema = z.infer<typeof modelFormSchema>
