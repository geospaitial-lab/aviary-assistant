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
import { z } from "zod"

const ERROR_NAME = "Muss ein gültiger Name sein"

export const gpkgFormSchema = z.object({
  path: z.string(),
  name: z
    .string()
    .min(1, ERROR_NAME)
    .refine(
      (name) => {
        return (
          name.trim().toLowerCase() !== "sursentia_landcover" &&
          name.trim().toLowerCase() !== "sursentia_solar"
        )
      },
      { message: ERROR_NAME },
    ),
})

export type GpkgFormSchema = z.infer<typeof gpkgFormSchema>
