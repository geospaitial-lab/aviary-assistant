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
  type PostprocessingFormSchema,
  postprocessingFormSchema,
} from "@/components/assistant/postprocessing/schema"
import { usePostprocessingStore } from "@/components/assistant/postprocessing/store"
import { Link } from "@/components/link"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { zodResolver } from "@hookform/resolvers/zod"

export function PostprocessingForm() {
  const { formValues, setFormValues } = usePostprocessingStore()

  const form = useForm<PostprocessingFormSchema>({
    resolver: zodResolver(postprocessingFormSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as PostprocessingFormSchema)
    })
    return () => subscription.unsubscribe()
  }, [form, setFormValues])

  return (
    <Form {...form}>
      <form autoComplete="off" noValidate onSubmit={(e) => e.preventDefault()}>
        <p className="text-pretty mb-4">
          Gib hier an, wie die Ausgabe unserer KI nachverarbeitet werden soll.
          Es werden Artefakte entfernt und optional die Polygone vereinfacht –
          das reduziert die Datenmenge, kann aber feine Details glätten.
        </p>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="sieveFillThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schwellenwert (Sieben und Füllen)</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={field.value}
                    onValueChange={(value) => value && field.onChange(value)}
                    className="w-full justify-center"
                    aria-label="Schwellenwert auswählen"
                  >
                    <ToggleGroupItem value="schwach" className="w-24">
                      schwach
                    </ToggleGroupItem>
                    <ToggleGroupItem value="moderat" className="w-24">
                      moderat
                    </ToggleGroupItem>
                    <ToggleGroupItem value="stark" className="w-24">
                      stark
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormDescription>
                  Entfernen von kleinen Polygonen und kleinen Löchern in
                  Polygonen
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="simplify"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <FormLabel>Vereinfachen</FormLabel>
                  <FormDescription>
                    Reduzieren von Stützpunkten der Polygone
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Link
            href="/faq#nachverarbeitung"
            showArrow={true}
            openInNewTab={true}
            className="text-sm"
          >
            Mehr erfahren
          </Link>
        </div>
      </form>
    </Form>
  )
}
