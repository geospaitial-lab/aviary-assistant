"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type BoundingBoxFormSchema,
  boundingBoxFormSchema,
  createGeoJson,
  initBoundary,
} from "@/components/assistant/area/bounding-box/schema"
import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"

export function BoundingBoxForm() {
  const { formValues, setFormValues, setGeoJson, reset } = useBoundingBoxStore()

  const form = useForm<BoundingBoxFormSchema>({
    resolver: zodResolver(boundingBoxFormSchema),
    defaultValues: {
      xMin: "",
      yMin: "",
      xMax: "",
      yMax: "",
      epsgCode: "4326",
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

  function onSubmit(values: BoundingBoxFormSchema) {
    const geoJson = createGeoJson(
      values.xMin,
      values.yMin,
      values.xMax,
      values.yMax,
      values.epsgCode,
    )

    setFormValues(values)
    setGeoJson(geoJson)

    console.log(geoJson)
  }

  function handleReset() {
    form.reset({
      xMin: "",
      yMin: "",
      xMax: "",
      yMax: "",
      epsgCode: "4326",
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
          className="grid gap-4 grid-cols-1 @md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="xMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>
                    x<sub>min</sub>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input type="text" inputMode="numeric" {...field} />
                </FormControl>
                <div className="min-h-[1.25rem]">
                  {form.formState.errors.xMin ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>Westliche Koordinate</FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>
                    y<sub>min</sub>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input type="text" inputMode="numeric" {...field} />
                </FormControl>
                <div className="min-h-[1.25rem]">
                  {form.formState.errors.yMin ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>Südliche Koordinate</FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="xMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>
                    x<sub>max</sub>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input type="text" inputMode="numeric" {...field} />
                </FormControl>
                <div className="min-h-[1.25rem]">
                  {form.formState.errors.xMax ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>Östliche Koordinate</FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>
                    y<sub>max</sub>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input type="text" inputMode="numeric" {...field} />
                </FormControl>
                <div className="min-h-[1.25rem]">
                  {form.formState.errors.yMax ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>Nördliche Koordinate</FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="epsgCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EPSG Code</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4326">4326</SelectItem>
                      <SelectSeparator />
                      <SelectItem value="25832">25832</SelectItem>
                      <SelectItem value="25833">25833</SelectItem>
                      <SelectItem value="3857">3857</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="min-h-[1.25rem]">
                  {form.formState.errors.epsgCode ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Koordinatenreferenzssystem
                    </FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
          <div className="mt-4 @md:col-span-2 flex justify-between">
            <div className="flex gap-4">
              <Button type="submit" className="w-32">
                Anzeigen
              </Button>
              <Button type="button" variant="outline" className="w-32">
                Bearbeiten
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              className="w-32"
              onClick={handleReset}
            >
              Entfernen
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
