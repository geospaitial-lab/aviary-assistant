import Ajv from "ajv"
import { z } from "zod"

import { geoJSONSchema } from "@/lib/geojson-schema"
import * as turf from "@turf/turf"

const ERROR_PARSE = "Muss eine gültige .geojson Datei sein"
const ERROR_RANGE = "Muss innerhalb von Deutschland liegen"
const ERROR_SIZE = "Muss kleiner als 1 MB sein"
const ERROR_TYPE = "Muss eine .geojson Datei sein"
const MAX_FILE_SIZE = 1024 * 1024

const ajv = new Ajv()
const isGeoJSONValid = ajv.compile(geoJSONSchema)

const BUFFER = 0.01
const RANGE = {
  xMin: 5.8663153,
  yMin: 47.2701114,
  xMax: 15.0419309,
  yMax: 55.099161,
}

const createRangeBoundingBox = () => {
  const rangeCoordinates = [RANGE.xMin, RANGE.yMin, RANGE.xMax, RANGE.yMax]
  const rangeBoundingBox = turf.bboxPolygon(rangeCoordinates)

  return turf.buffer(rangeBoundingBox, BUFFER, { units: "degrees" })
}

const isGeoJSONWithinRange = (geoJSON) => {
  try {
    const rangeBoundingBox = createRangeBoundingBox()

    const coordinates = turf.bbox(geoJSON)
    const boundingBox = turf.bboxPolygon(coordinates)

    return turf.booleanContains(rangeBoundingBox, boundingBox)
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
        const parsedJSON = JSON.parse(text)
        const isValidGeoJSON = isGeoJSONValid(parsedJSON)

        if (!isValidGeoJSON) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ERROR_PARSE,
          })
          return
        }

        const isWithinRange = isGeoJSONWithinRange(parsedJSON)
        if (!isWithinRange) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ERROR_RANGE,
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
