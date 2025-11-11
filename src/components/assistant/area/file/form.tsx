"use client"

/*
 * Copyright (C) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"

function truncateFileName(fileName: string, maxLength: number = 35): string {
  if (!fileName || fileName.length <= maxLength) return fileName

  const lastDotIndex = fileName.lastIndexOf(".")
  if (lastDotIndex === -1) {
    const charsToShow = maxLength - 3
    const halfLength = Math.floor(charsToShow / 2)
    return (
      fileName.substring(0, halfLength) +
      "..." +
      fileName.substring(fileName.length - halfLength)
    )
  }

  const extension = fileName.substring(lastDotIndex)
  const nameWithoutExtension = fileName.substring(0, lastDotIndex)

  const maxNameLength = maxLength - 3 - extension.length

  if (maxNameLength <= 0) {
    return fileName.substring(0, maxLength - 3) + "..."
  }

  const halfLength = Math.floor(maxNameLength / 2)
  const startChars = nameWithoutExtension.substring(0, halfLength)
  const endChars = nameWithoutExtension.substring(
    nameWithoutExtension.length - halfLength,
  )

  return startChars + "..." + endChars + extension
}

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
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <p className="text-pretty mb-4">
            Lade hier dein eigenes Gebiet hoch.
          </p>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Datei</FormLabel>
                  <FormControl>
                    <div className="relative group">
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
                        title=""
                        {...field}
                      />
                      <div
                        aria-invalid={
                          form.formState.errors.file ? true : undefined
                        }
                        className="flex flex-col items-center justify-center h-36 p-4 text-center gap-2 cursor-pointer transition-all border rounded-md shadow-xs dark:bg-input/30 dark:border-input group-hover:bg-accent group-hover:text-accent-foreground dark:group-hover:bg-input/50 group-focus-within:border-ring group-focus-within:ring-ring/50 group-focus-within:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive"
                      >
                        {selectedFileName ? (
                          <>
                            <Upload aria-hidden="true" />
                            <p className="text-sm font-medium">
                              {truncateFileName(selectedFileName)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Klicke zum Ändern
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload aria-hidden="true" />
                            <p className="text-sm font-medium">
                              Datei auswählen
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
                    {form.formState.errors.file ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        .geojson-Datei mit Polygonen
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <div className="mt-4 flex flex-col @md:flex-row @md:justify-between gap-4">
              <Button type="submit" className="w-24" disabled={isLoading}>
                <span className={cn(isLoading && "animate-pulse")}>
                  Anzeigen
                </span>
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={!geoJson || isLoading}
                onClick={handleReset}
                className="w-24"
              >
                Entfernen
              </Button>
            </div>
            <Link
              href="/faq#gebiet"
              showArrow={true}
              openInNewTab={true}
              className="text-sm w-fit"
            >
              Mehr erfahren
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
