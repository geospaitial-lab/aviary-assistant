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
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type GlobalFormSchema } from "@/components/assistant/data/global/schema"

interface GlobalState {
  formValues: GlobalFormSchema
  setFormValues: (values: GlobalFormSchema) => void
  reset: () => void
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      formValues: {
        epsgCode: "25832",
        groundSamplingDistance: "0.2",
      },
      setFormValues: (values) => set({ formValues: values }),
      reset: () =>
        set({
          formValues: {
            epsgCode: "25832",
            groundSamplingDistance: "0.2",
          },
        }),
    }),
    {
      name: "data-global-storage",
    },
  ),
)
