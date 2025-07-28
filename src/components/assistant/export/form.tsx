"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type ExportFormSchema,
  exportFormSchema,
} from "@/components/assistant/export/schema"
import { useExportStore } from "@/components/assistant/export/store"
import { Link } from "@/components/link"
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
      <form autoComplete="off" noValidate onSubmit={(e) => e.preventDefault()}>
        <p className="text-pretty mb-4">
          Gib hier an, in welchem Verzeichnis die Ergebnisse gespeichert werden
          sollen. Falls du den Pfad jetzt noch nicht kennst, kannst du das Feld
          freilassen und später nachtragen.
        </p>

        <FormField
          control={form.control}
          name="dirPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pfad zum Ausgabeverzeichnis</FormLabel>
              <FormControl>
                <Input type="text" placeholder="optional" {...field} />
              </FormControl>
              <div className="min-h-[1.25rem]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Link showArrow={true} className="text-sm">
          Mehr erfahren
        </Link>
      </form>
    </Form>
  )
}
