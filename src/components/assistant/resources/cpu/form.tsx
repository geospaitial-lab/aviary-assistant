"use client"

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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
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

  const ramValue = form.watch("ram")

  return (
    <Form {...form}>
      <form autoComplete="off" noValidate onSubmit={(e) => e.preventDefault()}>
        <p className="text-pretty mb-4">
          Gib hier an, wie viel RAM dein Prozessor zur Verfügung hat. Je mehr,
          desto schneller – die Qualität der Ergebnisse beeinflusst das aber
          nicht.
        </p>

        <div className="mb-4 relative h-6">
          <span
            className={cn(
              "absolute left-0 font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": ramValue !== 0,
              },
            )}
            onClick={() => form.setValue("ram", 0)}
          >
            8 GB
          </span>
          <span
            className={cn(
              "absolute left-1/3 transform -translate-x-1/2 font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": ramValue !== 1,
              },
            )}
            onClick={() => form.setValue("ram", 1)}
          >
            16 GB
          </span>
          <span
            className={cn(
              "absolute left-2/3 transform -translate-x-1/2 font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": ramValue !== 2,
              },
            )}
            onClick={() => form.setValue("ram", 2)}
          >
            32 GB
          </span>
          <span
            className={cn(
              "absolute right-0 text-right font-medium transition-color cursor-pointer",
              {
                "text-muted-foreground": ramValue !== 3,
              },
            )}
            onClick={() => form.setValue("ram", 3)}
          >
            64 GB
          </span>
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
              <div className="min-h-[1.25rem]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Link className="text-sm" showArrow={true}>
          Mehr erfahren
        </Link>
      </form>
    </Form>
  )
}
