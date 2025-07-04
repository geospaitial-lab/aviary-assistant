"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type FileFormSchema,
  fileFormSchema,
  initBoundary,
} from "@/components/assistant/file/schema"
import { useFileStore } from "@/components/assistant/file/store"
import { Button } from "@/components/ui/button"
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

export function FileForm() {
  const { formValues, setFormValues, setGeoJson } = useFileStore()

  const form = useForm<FileFormSchema>({
    resolver: zodResolver(fileFormSchema),
    defaultValues: {
      file: undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  React.useEffect(() => {
    if (formValues) {
      form.reset(formValues)
    }
  }, [form, formValues])

  React.useEffect(() => {
    void initBoundary()
  }, [])

  async function onSubmit(values: FileFormSchema) {
    const text = await values.file.text()
    const geoJson = JSON.parse(text)

    setFormValues(values)
    setGeoJson(geoJson)

    console.log(geoJson)
  }

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Datei</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    onChange(file)
                  }}
                  {...field}
                />
              </FormControl>
              <div className="min-h-[1.25rem]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Anzeigen</Button>
      </form>
    </Form>
  )
}
