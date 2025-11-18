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

import { toast } from "sonner"

import {
  type GpkgFormSchema,
  gpkgFormSchema,
} from "@/components/assistant/aggregation/gpkg/schema"
import { useAggregationStore } from "@/components/assistant/aggregation/store"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"

const ERROR_GPKG = "Die Datenquelle ist nicht richtig konfiguriert"

export interface GpkgFormRef {
  validate: () => Promise<boolean>
}

interface GpkgFormProps {
  aggregationSourceId: string
}

export const GpkgForm = React.forwardRef<GpkgFormRef, GpkgFormProps>(
  function GpkgForm({ aggregationSourceId }, ref) {
    const { aggregationSources, updateAggregationSource } =
      useAggregationStore()
    const aggregationSource = aggregationSources.find(
      (as) => as.id === aggregationSourceId,
    )
    const formValues = aggregationSource?.formValues as GpkgFormSchema | null

    const form = useForm<GpkgFormSchema>({
      resolver: zodResolver(gpkgFormSchema),
      defaultValues: formValues || {
        path: "",
        name: "",
      },
      mode: "onBlur",
      reValidateMode: "onBlur",
    })

    const validateForm = React.useCallback(async () => {
      return new Promise<boolean>((resolve) => {
        form.trigger().then((isValid) => {
          if (!isValid) {
            toast.error(ERROR_GPKG)
          }
          resolve(isValid)
        })
      })
    }, [form])

    React.useImperativeHandle(
      ref,
      () => ({
        validate: validateForm,
      }),
      [validateForm],
    )

    React.useEffect(() => {
      const subscription = form.watch((value) => {
        updateAggregationSource(aggregationSourceId, value as GpkgFormSchema)
      })
      return () => subscription.unsubscribe()
    }, [form, updateAggregationSource, aggregationSourceId])

    return (
      <div className="@container">
        <Form {...form}>
          <form
            autoComplete="off"
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="text-pretty mb-4">
              Gib hier an, welche .gpkg-Datei du nutzen möchtest. Falls du den
              Pfad jetzt noch nicht kennst, kannst du das Feld freilassen und
              später nachtragen.
            </p>

            <div className="grid gap-4 grid-cols-1">
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pfad</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="optional" {...field} />
                    </FormControl>
                    <FormDescription>Pfad zur .gpkg-Datei</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Name der aggregierten .gpkg-Datei
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    )
  },
)
