"use client"

import { z } from "zod"

const ERROR_INT = "Muss eine ganze Zahl sein"
const ERROR_NUMBER = "Muss eine Zahl sein"
const ERROR_POSITIVE = "Muss eine positive Zahl sein"

export const boundingBoxFormSchema = z
  .object({
    xMin: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number({
          invalid_type_error: ERROR_NUMBER,
        })
        .int(ERROR_INT),
    ),
    yMin: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number({
          invalid_type_error: ERROR_NUMBER,
        })
        .int(ERROR_INT),
    ),
    xMax: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number({
          invalid_type_error: ERROR_NUMBER,
        })
        .int(ERROR_INT),
    ),
    yMax: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number({
          invalid_type_error: ERROR_NUMBER,
        })
        .int(ERROR_INT),
    ),
    epsgCode: z.enum(["3857", "25832", "25833"]),
  })
  .refine((data) => data.xMin < data.xMax, {
    message: "Muss kleiner als x_max sein",
    path: ["xMin"],
  })
  .refine((data) => data.yMin < data.yMax, {
    message: "Muss kleiner als y_max sein",
    path: ["yMin"],
  })
  .refine(
    (data) => !["25832", "25833"].includes(data.epsgCode) || data.xMin > 0,
    {
      message: ERROR_POSITIVE,
      path: ["xMin"],
    },
  )
  .refine(
    (data) => !["25832", "25833"].includes(data.epsgCode) || data.xMax > 0,
    {
      message: ERROR_POSITIVE,
      path: ["xMax"],
    },
  )
  .refine(
    (data) => !["25832", "25833"].includes(data.epsgCode) || data.yMin > 0,
    {
      message: ERROR_POSITIVE,
      path: ["yMin"],
    },
  )
  .refine(
    (data) => !["25832", "25833"].includes(data.epsgCode) || data.yMax > 0,
    {
      message: ERROR_POSITIVE,
      path: ["yMax"],
    },
  )

export type BoundingBoxFormSchema = z.infer<typeof boundingBoxFormSchema>
