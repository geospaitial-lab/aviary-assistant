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
  type GpuFormSchema,
  gpuFormSchema,
} from "@/components/assistant/resources/gpu/schema"
import { useGpuStore } from "@/components/assistant/resources/gpu/store"
import { Link } from "@/components/link"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { zodResolver } from "@hookform/resolvers/zod"

export function GpuForm() {
  const { formValues, setFormValues } = useGpuStore()

  const form = useForm<GpuFormSchema>({
    resolver: zodResolver(gpuFormSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as GpuFormSchema)
    })
    return () => subscription.unsubscribe()
  }, [form, setFormValues])

  return (
    <Form {...form}>
      <form autoComplete="off" noValidate onSubmit={(e) => e.preventDefault()}>
        <p className="text-pretty mb-4">
          Gib hier an, wie viel VRAM deine Grafikkarte zur Verfügung hat. Je
          mehr, desto schneller – die Qualität der Ergebnisse beeinflusst das
          aber nicht.
        </p>

        <FormField
          control={form.control}
          name="vram"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={String(field.value)}
                  onValueChange={(value) =>
                    value && field.onChange(Number(value))
                  }
                  className="w-full justify-center"
                  aria-label="VRAM auswählen"
                >
                  <ToggleGroupItem value="0" className="w-20">
                    8 GB
                  </ToggleGroupItem>
                  <ToggleGroupItem value="1" className="w-20">
                    12 GB
                  </ToggleGroupItem>
                  <ToggleGroupItem value="2" className="w-20">
                    16 GB
                  </ToggleGroupItem>
                  <ToggleGroupItem value="3" className="w-20">
                    24 GB
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <div className="min-h-[1.25rem]" />
            </FormItem>
          )}
        />
        <Link
          href="/faq#ressourcen"
          showArrow={true}
          openInNewTab={true}
          className="text-sm"
        >
          Mehr erfahren
        </Link>
      </form>
    </Form>
  )
}
