"use client"

import { z } from "zod"

const ERROR_INT = "Muss eine ganze Zahl sein"
const ERROR_POSITIVE = "Muss eine positive Zahl sein"

export const boundingBoxFormSchema = z
  .object({
    x_min: z.number().int(ERROR_INT),
    x_max: z.number().int(ERROR_INT),
    y_min: z.number().int(ERROR_INT),
    y_max: z.number().int(ERROR_INT),
    epsg_code: z.enum(["3857", "25832", "25833"]),
  })
  .refine((data) => data.x_min < data.x_max, {
    message: "Muss kleiner als x<sub>max</sub> sein",
    path: ["x_min"],
  })
  .refine((data) => data.y_min < data.y_max, {
    message: "Muss kleiner als y<sub>max</sub> sein",
    path: ["y_min"],
  })
  .refine(
    (data) => !["25832", "25833"].includes(data.epsg_code) || data.x_min > 0,
    {
      message: ERROR_POSITIVE,
      path: ["x_min"],
    },
  )
  .refine(
    (data) => !["25832", "25833"].includes(data.epsg_code) || data.x_max > 0,
    {
      message: ERROR_POSITIVE,
      path: ["x_max"],
    },
  )
  .refine(
    (data) => !["25832", "25833"].includes(data.epsg_code) || data.y_min > 0,
    {
      message: ERROR_POSITIVE,
      path: ["y_min"],
    },
  )
  .refine(
    (data) => !["25832", "25833"].includes(data.epsg_code) || data.y_max > 0,
    {
      message: ERROR_POSITIVE,
      path: ["y_max"],
    },
  )

export type BoundingBoxFormSchema = z.infer<typeof boundingBoxFormSchema>
