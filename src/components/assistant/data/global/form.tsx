"use client"

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
import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type GlobalFormSchema,
  globalFormSchema,
} from "@/components/assistant/data/global/schema"
import { useGlobalStore } from "@/components/assistant/data/global/store"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"

export function GlobalForm() {
  const { formValues, setFormValues } = useGlobalStore()

  const form = useForm<GlobalFormSchema>({
    resolver: zodResolver(globalFormSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as GlobalFormSchema)
    })
    return () => subscription.unsubscribe()
  }, [form, setFormValues])

  return (
    <div className="@container">
      <Form {...form}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <p className="text-pretty mb-4">
            Gib hier an, welcher EPSG Code und welche Bodenauflösung für deine
            Daten verwendet werden sollen.
          </p>

          <div className="grid gap-4 grid-cols-1 @lg:grid-cols-2">
            <FormField
              control={form.control}
              name="epsgCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EPSG Code</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="25832">25832</SelectItem>
                        <SelectItem value="25833">25833</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Koordinatenreferenzsystem</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groundSamplingDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bodenauflösung</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="0.1">0.1 m/px</SelectItem>
                        <SelectItem value="0.2">0.2 m/px</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Räumliche Auflösung der Pixel
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
