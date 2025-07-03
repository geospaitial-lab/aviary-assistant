import proj4 from "proj4"
import { z } from "zod"

import { booleanContains } from "@turf/boolean-contains"
import { buffer } from "@turf/buffer"
import { AllGeoJSON, polygon } from "@turf/helpers"

const ERROR_BOUNDARY = "Muss in Deutschland liegen"
const ERROR_NUMBER = "Muss eine Zahl sein"

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

export const createGeoJson = (
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
  epsgCode: string,
) => {
  let coordinates = [
    [xMin, yMin],
    [xMax, yMin],
    [xMax, yMax],
    [xMin, yMax],
    [xMin, yMin],
  ]

  if (epsgCode !== "4326") {
    const fromProjection = getProjectionString(epsgCode)
    const toProjection = "EPSG:4326"

    coordinates = coordinates.map(([x, y]) => {
      return proj4(fromProjection, toProjection, [x, y])
    })
  }

  return polygon([coordinates])
}

const getProjectionString = (epsgCode: string): string => {
  switch (epsgCode) {
    case "25832":
      return "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    case "25833":
      return "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    case "3857":
      return "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs"
    case "4326":
    default:
      return "+proj=longlat +datum=WGS84 +no_defs"
  }
}

export const boundingBoxFormSchema = z
  .object({
    xMin: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number({
        invalid_type_error: ERROR_NUMBER,
      }),
    ),
    yMin: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number({
        invalid_type_error: ERROR_NUMBER,
      }),
    ),
    xMax: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number({
        invalid_type_error: ERROR_NUMBER,
      }),
    ),
    yMax: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number({
        invalid_type_error: ERROR_NUMBER,
      }),
    ),
    epsgCode: z.enum(["4326", "25832", "25833", "3857"]),
  })
  .refine((data) => data.xMin < data.xMax, {
    message: "Muss kleiner als x<sub>max</sub> sein",
    path: ["xMin"],
  })
  .refine((data) => data.yMin < data.yMax, {
    message: "Muss kleiner als y<sub>max</sub> sein",
    path: ["yMin"],
  })
  .superRefine(async (data, ctx) => {
    const geoJson = createGeoJson(
      data.xMin,
      data.yMin,
      data.xMax,
      data.yMax,
      data.epsgCode,
    )

    const isWithinBoundary = await isGeoJsonWithinBoundary(geoJson)
    if (!isWithinBoundary) {
      ;["xMin", "yMin", "xMax", "yMax"].forEach((field) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: ERROR_BOUNDARY,
          path: [field],
        })
      })
    }
  })

export type BoundingBoxFormSchema = z.infer<typeof boundingBoxFormSchema>
