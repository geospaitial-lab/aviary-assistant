"use client"

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
    defaultValues: formValues || {
      epsgCode: "25832",
      groundSamplingDistance: "0.2",
    },
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
                        <SelectItem value="0.5">0.5 m/px</SelectItem>
                        <SelectItem value="1.0">1.0 m/px</SelectItem>
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
