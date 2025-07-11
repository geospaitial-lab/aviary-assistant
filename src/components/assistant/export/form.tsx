"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type ExportFormSchema,
  exportFormSchema,
} from "@/components/assistant/export/schema"
import { useExportStore } from "@/components/assistant/export/store"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"

export function ExportForm() {
  const { formValues, setFormValues } = useExportStore()

  const form = useForm<ExportFormSchema>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: formValues || {
      dirPath: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as ExportFormSchema)
    })
    return () => subscription.unsubscribe()
  }, [form, setFormValues])

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        noValidate
        onSubmit={(e) => e.preventDefault()}
        className="p-4 border rounded-lg"
      >
        <FormField
          control={form.control}
          name="dirPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ausgabeverzeichnis</FormLabel>
              <FormControl>
                <Input type="text" placeholder="optional" {...field} />
              </FormControl>
              <div className="min-h-[1.25rem]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
