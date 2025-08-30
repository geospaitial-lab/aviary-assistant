"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { toast } from "sonner"

import { useDataStore } from "@/components/assistant/data/store"
import {
  type WmsFormSchema,
  wmsFormSchema,
} from "@/components/assistant/data/wms/schema"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"

const ERROR_WMS = "Die Datenquelle ist nicht richtig konfiguriert"

export interface WmsFormRef {
  validate: () => Promise<boolean>
}

interface WmsFormProps {
  dataSourceId: string
}

export const WmsForm = React.forwardRef<WmsFormRef, WmsFormProps>(
  function WmsForm({ dataSourceId }, ref) {
    const { dataSources, updateDataSource } = useDataStore()
    const dataSource = dataSources.find((ds) => ds.id === dataSourceId)
    const formValues = dataSource?.formValues as WmsFormSchema | null

    const form = useForm<WmsFormSchema>({
      resolver: zodResolver(wmsFormSchema),
      defaultValues: formValues || {
        url: "",
        version: "1.3.0",
        layer: "",
        format: ".png",
        style: "",
      },
      mode: "onBlur",
      reValidateMode: "onBlur",
    })

    const validateForm = React.useCallback(async () => {
      return new Promise<boolean>((resolve) => {
        form.trigger().then((isValid) => {
          if (!isValid) {
            toast.error(ERROR_WMS)
          }
          resolve(isValid)
        })
      })
    }, [form])

    React.useImperativeHandle(
      ref,
      () => ({
        validate: validateForm,
      }),
      [validateForm],
    )

    React.useEffect(() => {
      const subscription = form.watch((value) => {
        updateDataSource(dataSourceId, value as WmsFormSchema)
      })
      return () => subscription.unsubscribe()
    }, [form, updateDataSource, dataSourceId])

    return (
      <div className="@container">
        <Form {...form}>
          <form
            autoComplete="off"
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-4 grid-cols-1 @lg:grid-cols-2">
              <div className="@lg:col-span-2">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <div className="min-h-[1.25rem]">
                        {form.formState.errors.url ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>TODO</FormDescription>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          <SelectItem value="1.1.1">1.1.1</SelectItem>
                          <SelectItem value="1.3.0">1.3.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>TODO</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="layer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layer</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <div className="min-h-[1.25rem]">
                      {form.formState.errors.layer ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>Name der Ebene</FormDescription>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          <SelectItem value=".jpeg">.jpeg</SelectItem>
                          <SelectItem value=".png">.png</SelectItem>
                          <SelectItem value=".tiff">.tiff</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Bildformat</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="optional" {...field} />
                    </FormControl>
                    <FormDescription>Darstellungsstil</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    )
  },
)
