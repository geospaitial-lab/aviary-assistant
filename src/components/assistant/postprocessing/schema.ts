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

export const postprocessingFormSchema = z.object({
  sieve: z.enum(["schwach", "moderat", "stark"]),
  fill: z.enum(["schwach", "moderat", "stark"]),
  simplify: z.boolean(),
})

export type PostprocessingFormSchema = z.infer<typeof postprocessingFormSchema>
