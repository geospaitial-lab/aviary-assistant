import Ajv from "ajv"
import { z } from "zod"

import { geoJsonSchema } from "@/lib/geojson-schema"
import { bbox } from "@turf/bbox"
import { bboxPolygon } from "@turf/bbox-polygon"
import { booleanContains } from "@turf/boolean-contains"
import { buffer } from "@turf/buffer"
import { AllGeoJSON } from "@turf/helpers"

const ERROR_PARSE = "Muss eine gültige .geojson Datei sein"
const ERROR_RANGE = "Muss innerhalb von Deutschland liegen"
const ERROR_SIZE = "Muss kleiner als 1 MB sein"
const ERROR_TYPE = "Muss eine .geojson Datei sein"
const MAX_FILE_SIZE = 1024 * 1024

const ajv = new Ajv()
const isGeoJsonValid = ajv.compile(geoJsonSchema)

const BUFFER = 0.01
const RANGE = {
  xMin: 5.8663153,
  yMin: 47.2701114,
  xMax: 15.0419309,
  yMax: 55.099161,
}

const createRangeBoundingBox = () => {
  const rangeCoordinates: [number, number, number, number] = [
    RANGE.xMin,
    RANGE.yMin,
    RANGE.xMax,
    RANGE.yMax,
  ]
  const rangeBoundingBox = bboxPolygon(rangeCoordinates)

  return buffer(rangeBoundingBox, BUFFER, { units: "degrees" })
}

const isGeoJsonWithinRange = (geoJson: AllGeoJSON) => {
  try {
    const rangeBoundingBox = createRangeBoundingBox()

    const coordinates = bbox(geoJson)
    const boundingBox = bboxPolygon(coordinates)

    return booleanContains(rangeBoundingBox, boundingBox)
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

        const isWithinRange = isGeoJsonWithinRange(parsedJson as AllGeoJSON)
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
