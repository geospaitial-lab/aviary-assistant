"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { toast } from "sonner"

import {
  type VrtFormSchema,
  vrtFormSchema,
} from "@/components/assistant/data/vrt/schema"
import { useVrtStore } from "@/components/assistant/data/vrt/store"
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

const ERROR_VRT = "Die Datenquelle ist nicht richtig konfiguriert"

export interface VrtFormRef {
  validate: () => Promise<boolean>
}

export const VrtForm = React.forwardRef<VrtFormRef>(function VrtForm(_, ref) {
  const { formValues, setFormValues } = useVrtStore()

  const form = useForm<VrtFormSchema>({
    resolver: zodResolver(vrtFormSchema) as any,
    defaultValues:
      formValues ||
      ({
        path: "",
        epsgCode: "25832",
        channels: "rgb",
        groundSamplingDistance: "0.2",
      } as any),
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as VrtFormSchema)
    })
    return () => subscription.unsubscribe()
  }, [form, setFormValues])

  const validateForm = React.useCallback(async () => {
    return new Promise<boolean>((resolve) => {
      form.trigger().then((isValid) => {
        if (!isValid) {
          toast.error(ERROR_VRT)
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
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pfad</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="optional" {...field} />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.path ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Pfad zur .vrt-Datei</FormDescription>
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
                        <SelectItem value="rgbi">RGBI</SelectItem>
                        <SelectItem value="dom">DOM</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    {form.formState.errors.channels ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>TODO</FormDescription>
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
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="0.1">0.1 m / px</SelectItem>
                        <SelectItem value="0.2">0.2 m / px</SelectItem>
                        <SelectItem value="0.5">0.5 m / px</SelectItem>
                        <SelectItem value="1.0">1.0 m / px</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
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
              className="text-sm w-fit"
            >
              Mehr erfahren
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
})
