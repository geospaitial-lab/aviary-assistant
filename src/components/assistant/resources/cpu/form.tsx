"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type CpuFormSchema,
  cpuFormSchema,
} from "@/components/assistant/resources/cpu/schema"
import { useCpuStore } from "@/components/assistant/resources/cpu/store"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { zodResolver } from "@hookform/resolvers/zod"

export function CpuForm() {
  const { formValues, setFormValues } = useCpuStore()

  const form = useForm<CpuFormSchema>({
    resolver: zodResolver(cpuFormSchema),
    defaultValues: formValues || {
      ram: 1,
    },
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
        <p className="mb-4">
          Gib hier an, wie viel RAM dein Prozessor zur Verfügung hat.
        </p>

        <div className="mb-4 relative h-6">
          <span className="absolute left-0">8 GB</span>
          <span className="absolute left-1/3 transform -translate-x-1/2">
            16 GB
          </span>
          <span className="absolute left-2/3 transform -translate-x-1/2">
            32 GB
          </span>
          <span className="absolute right-0 text-right">64 GB</span>
        </div>
        <FormField
          control={form.control}
          name="ram"
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
