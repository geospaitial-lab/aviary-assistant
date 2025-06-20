import { z } from "zod"

const ERROR_EXTENSION = "Muss eine .geojson Datei sein"
const ERROR_SIZE = "Muss kleiner als 1 MB sein"
const MAX_FILE_SIZE = 1024 * 1024

export const fileFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.name.toLowerCase().endsWith(".geojson"), {
      message: ERROR_EXTENSION,
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: ERROR_SIZE,
    }),
})

export type FileFormSchema = z.infer<typeof fileFormSchema>
