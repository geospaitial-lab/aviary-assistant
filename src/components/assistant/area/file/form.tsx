"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Upload } from "lucide-react"

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
  const {
    fileName,
    geoJson,
    isLoading,
    setFormValues,
    setFileName,
    setGeoJson,
    setIsLoading,
    reset,
  } = useFileStore()

  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(
    fileName,
  )

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

  React.useEffect(() => {
    setSelectedFileName(fileName)
  }, [fileName])

  async function onSubmit(values: FileFormSchema) {
    setIsLoading(true)

    try {
      const text = await values.file.text()
      const geoJson = JSON.parse(text)

      setFormValues(values)
      setFileName(values.file.name)
      setGeoJson(geoJson)
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    form.reset({
      file: undefined,
    })

    setSelectedFileName(null)
    reset()
  }

  function handleSubmit(e: React.FormEvent) {
    if (fileName && geoJson && !form.getValues().file) {
      e.preventDefault()

      const geoJsonCopy = { ...geoJson }
      setGeoJson(geoJsonCopy)
      return
    }

    form.handleSubmit(onSubmit)(e)
  }

  return (
    <div className="@container">
      <Form {...form}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Datei</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="file"
                      accept=".geojson"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedFileName(file.name)
                        } else {
                          setSelectedFileName(null)
                        }
                        onChange(file)
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full"
                      {...field}
                    />
                    <div className="border border-input rounded-md h-36 flex flex-col items-center justify-center p-4 text-center gap-2">
                      {selectedFileName ? (
                        <>
                          <Upload aria-hidden="true" />
                          <p className="text-sm font-medium">
                            {selectedFileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Klicke zum Ändern
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload aria-hidden="true" />
                          <p className="text-sm font-medium">
                            .geojson Datei auswählen
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Max. 1 MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </FormControl>
                <div className="min-h-[1.25rem]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="mt-4 flex flex-col @md:flex-row @md:justify-between gap-4">
            <div className="flex gap-4">
              <Button type="submit" className="w-24" disabled={isLoading}>
                <span className={cn(isLoading && "animate-pulse")}>
                  Anzeigen
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-24"
                disabled={!geoJson || isLoading}
              >
                Bearbeiten
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              className="w-24"
              disabled={!geoJson || isLoading}
              onClick={handleReset}
            >
              Entfernen
            </Button>
          </div>
          <Link
            href="/faq#gebiet"
            showArrow={true}
            openInNewTab={true}
            className="text-sm"
          >
            Mehr erfahren
          </Link>
        </form>
      </Form>
    </div>
  )
}
