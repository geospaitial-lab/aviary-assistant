"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type GpuFormSchema,
  gpuFormSchema,
} from "@/components/assistant/resources/gpu/schema"
import { useGpuStore } from "@/components/assistant/resources/gpu/store"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { zodResolver } from "@hookform/resolvers/zod"

export function GpuForm() {
  const { formValues, setFormValues } = useGpuStore()

  const form = useForm<GpuFormSchema>({
    resolver: zodResolver(gpuFormSchema),
    defaultValues: formValues || {
      vram: 1,
    },
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
        <p className="mb-4">
          Gib hier an, wie viel VRAM deine Grafikkarte zur Verfügung hat.
        </p>

        <div className="mb-4 relative h-6">
          <span className="absolute left-0">8 GB</span>
          <span className="absolute left-1/3 transform -translate-x-1/2">
            12 GB
          </span>
          <span className="absolute left-2/3 transform -translate-x-1/2">
            16 GB
          </span>
          <span className="absolute right-0 text-right">24 GB</span>
        </div>
        <FormField
          control={form.control}
          name="vram"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Slider
                  min={0}
                  max={3}
                  value={[field.value]}
                  onValueChange={(values) => {
                    field.onChange(values[0])
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="h-8"></div>
      </form>
    </Form>
  )
}
