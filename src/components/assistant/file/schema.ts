import Ajv from "ajv"
import { z } from "zod"

import { geoJSONSchema } from "@/lib/geojson-schema"

const ERROR_PARSE = "Muss eine gültige .geojson Datei sein"
const ERROR_SIZE = "Muss kleiner als 1 MB sein"
const ERROR_TYPE = "Muss eine .geojson Datei sein"
const MAX_FILE_SIZE = 1024 * 1024

const ajv = new Ajv()
const validateGeoJSON = ajv.compile(geoJSONSchema)

export const fileFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.name.endsWith(".geojson"), {
      message: ERROR_TYPE,
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: ERROR_SIZE,
    })
    .superRefine(async (file, ctx) => {
      try {
        const text = await file.text()
        const parsedJSON = JSON.parse(text)
        const isValidGeoJSON = validateGeoJSON(parsedJSON)
        if (!isValidGeoJSON) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ERROR_PARSE,
          })
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: ERROR_PARSE,
        })
      }
    }),
})

export type FileFormSchema = z.infer<typeof fileFormSchema>
