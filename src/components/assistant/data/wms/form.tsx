"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type WmsFormSchema,
  wmsFormSchema,
} from "@/components/assistant/data/wms/schema"
import { useWmsStore } from "@/components/assistant/data/wms/store"
import { Link } from "@/components/link"
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

export function WmsForm() {
  const { formValues, setFormValues } = useWmsStore()

  const form = useForm<WmsFormSchema>({
    resolver: zodResolver(wmsFormSchema) as any,
    defaultValues:
      formValues ||
      ({
        url: "",
        version: "1.3.0",
        layer: "",
        format: ".png",
        style: "",
        epsgCode: "25832",
        channels: "rgb",
        groundSamplingDistance: "",
      } as any),
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as WmsFormSchema)
    })
    return () => subscription.unsubscribe()
  }, [form, setFormValues])

  return (
    <div className="@container">
      <Form {...form}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 grid-cols-1 @lg:grid-cols-2">
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
                      <FormDescription>
                        Webadresse des WMS-Dienstes
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="1.1.1">1.1.1</SelectItem>
                        <SelectItem value="1.3.0">1.3.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.version ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Version des WMS-Protokolls
                      </FormDescription>
                    )}
                  </div>
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.format ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Bildformat</FormDescription>
                    )}
                  </div>
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
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.style ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Darstellungsstil</FormDescription>
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
                      <SelectContent className="z-[1000]">
                        <SelectItem value="25832">25832</SelectItem>
                        <SelectItem value="25833">25833</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.epsgCode ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Koordinatenreferenzsystem
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kanäle</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="rgb">RGB</SelectItem>
                        <SelectItem value="cir">CIR</SelectItem>
                        <SelectItem value="nir">NIR</SelectItem>
                        <SelectItem value="dom">DOM</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.channels ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Kanäle</FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groundSamplingDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bodenauflösung</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        className="pr-16"
                        {...field}
                      />
                    </FormControl>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                      m / px
                    </span>
                  </div>
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.groundSamplingDistance ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Räumliche Auflösung der Pixel
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <Link
              href="/faq#daten"
              showArrow={true}
              openInNewTab={true}
              className="text-sm"
            >
              Mehr erfahren
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
