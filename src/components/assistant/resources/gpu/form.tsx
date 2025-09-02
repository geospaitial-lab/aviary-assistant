"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type GpuFormSchema,
  gpuFormSchema,
} from "@/components/assistant/resources/gpu/schema"
import { useGpuStore } from "@/components/assistant/resources/gpu/store"
import { Link } from "@/components/link"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
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

  const vramValue = form.watch("vram")

  return (
    <Form {...form}>
      <form autoComplete="off" noValidate onSubmit={(e) => e.preventDefault()}>
        <p className="text-pretty mb-4">
          Gib hier an, wie viel VRAM deine Grafikkarte zur Verfügung hat. Je
          mehr, desto schneller – die Qualität der Ergebnisse beeinflusst das
          aber nicht.
        </p>

        <div className="mb-4 relative h-6">
          <span
            className={cn(
              "absolute left-0 font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": vramValue !== 0,
              },
            )}
            onClick={() => form.setValue("vram", 0)}
          >
            8 GB
          </span>
          <span
            className={cn(
              "absolute left-1/3 transform -translate-x-1/2 font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": vramValue !== 1,
              },
            )}
            onClick={() => form.setValue("vram", 1)}
          >
            12 GB
          </span>
          <span
            className={cn(
              "absolute left-2/3 transform -translate-x-1/2 font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": vramValue !== 2,
              },
            )}
            onClick={() => form.setValue("vram", 2)}
          >
            16 GB
          </span>
          <span
            className={cn(
              "absolute right-0 text-right font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": vramValue !== 3,
              },
            )}
            onClick={() => form.setValue("vram", 3)}
          >
            24 GB
          </span>
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
