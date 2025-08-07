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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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

        <div className="grid gap-4 grid-cols-1">
          <FormField
            control={form.control}
            name="dirPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pfad</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="optional" {...field} />
                </FormControl>
                <FormDescription>Pfad zum Ausgabeverzeichnis</FormDescription>
              </FormItem>
            )}
          />
          <Link
            href="/faq#export"
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
