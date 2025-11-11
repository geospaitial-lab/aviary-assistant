/*
 * Copyright (C) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import Ajv from "ajv"
import { z } from "zod"

import { geoJsonSchema } from "@/lib/geojson-schema"
import { booleanContains } from "@turf/boolean-contains"
import { type AllGeoJSON } from "@turf/helpers"

const ERROR_BOUNDARY = "Muss in Deutschland liegen"
const ERROR_PARSE = "Muss eine gültige .geojson-Datei sein"
const ERROR_SIZE = "Muss kleiner als 1 MB sein"
const ERROR_TYPE = "Muss eine .geojson-Datei sein"
const MAX_FILE_SIZE = 1024 * 1024

const ajv = new Ajv()
const isGeoJsonValid = ajv.compile(geoJsonSchema)

const createBoundaryManager = (() => {
  let boundary: any = null

  return async function (): Promise<any> {
    if (boundary) return boundary

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/boundary_de.geojson`,
    )
    return await response.json()
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
