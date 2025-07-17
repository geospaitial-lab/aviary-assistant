"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type FileFormSchema,
  fileFormSchema,
  initBoundary,
} from "@/components/assistant/area/file/schema"
import { useFileStore } from "@/components/assistant/area/file/store"
import { Link } from "@/components/link"
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
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"

export function FileForm() {
  const { geoJson, setFormValues, setGeoJson, reset } = useFileStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FileFormSchema>({
    resolver: zodResolver(fileFormSchema),
    defaultValues: {
      file: undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  React.useEffect(() => {
    void initBoundary()
  }, [])

  async function onSubmit(values: FileFormSchema) {
    setIsSubmitting(true)

    try {
      const text = await values.file.text()
      const geoJson = JSON.parse(text)

      setFormValues(values)
      setGeoJson(geoJson)

      console.log(geoJson)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    form.reset({
      file: undefined,
    })

    reset()
  }

  return (
    <div className="@container">
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
          <div className="mt-4 flex flex-col @md:flex-row @md:justify-between gap-4">
            <div className="flex gap-4">
              <Button type="submit" className="w-32" disabled={isSubmitting}>
                <span className={cn(isSubmitting && "animate-pulse")}>
                  Anzeigen
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-32"
                disabled={!geoJson}
              >
                Bearbeiten
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              className="w-32"
              disabled={!geoJson}
              onClick={handleReset}
            >
              Entfernen
            </Button>
          </div>
          <Link className="text-sm" showArrow={true}>
            Mehr erfahren
          </Link>
        </form>
      </Form>
    </div>
  )
}
