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
  type CpuFormSchema,
  cpuFormSchema,
} from "@/components/assistant/resources/cpu/schema"
import { useCpuStore } from "@/components/assistant/resources/cpu/store"
import { Link } from "@/components/link"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { zodResolver } from "@hookform/resolvers/zod"

export function CpuForm() {
  const { formValues, setFormValues } = useCpuStore()

  const form = useForm<CpuFormSchema>({
    resolver: zodResolver(cpuFormSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as CpuFormSchema)
    })
    return () => subscription.unsubscribe()
  }, [form, setFormValues])

  return (
    <Form {...form}>
      <form autoComplete="off" noValidate onSubmit={(e) => e.preventDefault()}>
        <p className="text-pretty mb-4">
          Gib hier an, wie viel RAM dein Prozessor zur Verfügung hat. Je mehr,
          desto schneller ist unsere KI – die Qualität der Ergebnisse
          beeinflusst das aber nicht.
        </p>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="ram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RAM</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={String(field.value)}
                    onValueChange={(value) =>
                      value && field.onChange(Number(value))
                    }
                    className="w-full justify-center"
                    aria-label="RAM auswählen"
                  >
                    <ToggleGroupItem value="0" className="w-16">
                      8 GB
                    </ToggleGroupItem>
                    <ToggleGroupItem value="1" className="w-16">
                      16 GB
                    </ToggleGroupItem>
                    <ToggleGroupItem value="2" className="w-16">
                      32 GB
                    </ToggleGroupItem>
                    <ToggleGroupItem value="3" className="w-16">
                      64 GB
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormDescription>Arbeitsspeicher</FormDescription>
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
        </div>
      </form>
    </Form>
  )
}
