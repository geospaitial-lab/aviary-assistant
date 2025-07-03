import { z } from "zod"

const ERROR_NUMBER = "Muss eine Zahl sein"

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

export type BoundingBoxFormSchema = z.infer<typeof boundingBoxFormSchema>
