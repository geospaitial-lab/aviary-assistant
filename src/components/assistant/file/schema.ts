import Ajv from "ajv"
import { z } from "zod"

import { geoJsonSchema } from "@/lib/geojson-schema"
import { booleanContains } from "@turf/boolean-contains"
import { buffer } from "@turf/buffer"
import { AllGeoJSON } from "@turf/helpers"

const ERROR_BOUNDARY = "Muss in Deutschland liegen"
const ERROR_PARSE = "Muss eine gültige .geojson Datei sein"
const ERROR_SIZE = "Muss kleiner als 1 MB sein"
const ERROR_TYPE = "Muss eine .geojson Datei sein"
const MAX_FILE_SIZE = 1024 * 1024

const ajv = new Ajv()
const isGeoJsonValid = ajv.compile(geoJsonSchema)

const BUFFER = 0.01

const createBoundaryManager = (() => {
  let boundary: any = null

  return async function (): Promise<any> {
    if (boundary) return boundary

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/boundary_de.geojson`,
    )
    const geoJson = await response.json()

    boundary = buffer(geoJson, BUFFER, { units: "degrees" })
    return boundary
  }
})()

export const initBoundary = createBoundaryManager

const isGeoJsonWithinBoundary = async (geoJson: AllGeoJSON) => {
  try {
    const boundary = await initBoundary()

    if (geoJson.type === "FeatureCollection") {
      for (const feature of geoJson.features) {
        if (!booleanContains(boundary, feature)) {
          return false
        }
      }
      return true
    }

    return booleanContains(boundary, geoJson)
  } catch (error) {
    return false
  }
}

export const fileFormSchema = z.object({
  file: z
    .instanceof(File, {
      message: ERROR_TYPE,
    })
    .refine((file) => file.name.endsWith(".geojson"), {
      message: ERROR_TYPE,
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: ERROR_SIZE,
    })
    .superRefine(async (file, ctx) => {
      try {
        const text = await file.text()
        const parsedJson = JSON.parse(text)
        const isValidGeoJson = isGeoJsonValid(parsedJson)

        if (!isValidGeoJson) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ERROR_PARSE,
          })
          return
        }

        const isWithinBoundary = await isGeoJsonWithinBoundary(
          parsedJson as AllGeoJSON,
        )
        if (!isWithinBoundary) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ERROR_BOUNDARY,
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
