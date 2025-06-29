import { z } from "zod"

const ERROR_NUMBER = "Muss eine Zahl sein"
const ERROR_RANGE = "Muss innerhalb von Deutschland liegen"

const EPSG_CODE_RANGES = {
  "4326": {
    xMin: 5.8519653,
    yMin: 47.2611114,
    xMax: 15.0562809,
    yMax: 55.108161,
  },
  "25832": {
    xMin: 261846.65275271083,
    yMin: 5238988.637424169,
    xMax: 886119.2314068729,
    yMax: 6123591.808462452,
  },
  "25833": {
    xMin: -191849.561115938,
    yMin: 5274913.218259724,
    xMax: 503590.51513724163,
    yMax: 6106829.022957785,
  },
  "3857": {
    xMin: 651437.7973359064,
    yMin: 5984798.7310148375,
    xMax: 1676057.523028491,
    yMax: 7382886.318265716,
  },
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
  .refine(
    (data) => {
      const range =
        EPSG_CODE_RANGES[data.epsgCode as keyof typeof EPSG_CODE_RANGES]
      return data.xMin >= range.xMin && data.xMin <= range.xMax
    },
    {
      message: ERROR_RANGE,
      path: ["xMin"],
    },
  )
  .refine(
    (data) => {
      const range =
        EPSG_CODE_RANGES[data.epsgCode as keyof typeof EPSG_CODE_RANGES]
      return data.yMin >= range.yMin && data.yMin <= range.yMax
    },
    {
      message: ERROR_RANGE,
      path: ["yMin"],
    },
  )
  .refine(
    (data) => {
      const range =
        EPSG_CODE_RANGES[data.epsgCode as keyof typeof EPSG_CODE_RANGES]
      return data.xMax >= range.xMin && data.xMax <= range.xMax
    },
    {
      message: ERROR_RANGE,
      path: ["xMax"],
    },
  )
  .refine(
    (data) => {
      const range =
        EPSG_CODE_RANGES[data.epsgCode as keyof typeof EPSG_CODE_RANGES]
      return data.yMax >= range.yMin && data.yMax <= range.yMax
    },
    {
      message: ERROR_RANGE,
      path: ["yMax"],
    },
  )
  .refine((data) => data.xMin < data.xMax, {
    message: "Muss kleiner als x<sub>max</sub> sein",
    path: ["xMin"],
  })
  .refine((data) => data.yMin < data.yMax, {
    message: "Muss kleiner als y<sub>max</sub> sein",
    path: ["yMin"],
  })

export type BoundingBoxFormSchema = z.infer<typeof boundingBoxFormSchema>
