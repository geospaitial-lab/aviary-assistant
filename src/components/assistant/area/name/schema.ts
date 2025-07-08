import { z } from "zod"

const ERROR_NAME = "Muss ein Name sein"

export const nameFormSchema = z.object({
  name: z.string().min(1, ERROR_NAME),
})

export type NameFormSchema = z.infer<typeof nameFormSchema>
