"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  type VrtFormSchema,
  vrtFormSchema,
} from "@/components/assistant/data/vrt/schema"
import { useVrtStore } from "@/components/assistant/data/vrt/store"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"

export function VrtForm() {
  const { formValues, setFormValues } = useVrtStore()

  const form = useForm<VrtFormSchema>({
    resolver: zodResolver(vrtFormSchema) as any,
    defaultValues:
      formValues ||
      ({
        path: "",
        channels: "RGB",
        groundSamplingDistance: "",
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

  return (
    <div className="@container">
      <Form {...form}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-4 grid-cols-1 @lg:grid-cols-2"
        >
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
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="channels"
            render={({ field }) => (
              <FormItem className="@lg:col-start-1">
                <FormLabel>Kanäle</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                      <SelectItem value="RGB">RGB</SelectItem>
                      <SelectItem value="CIR">CIR</SelectItem>
                      <SelectItem value="NIR">NIR</SelectItem>
                      <SelectItem value="RGBI">RGBI</SelectItem>
                      <SelectItem value="DOM">DOM</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="min-h-[1.25rem]">
                  <FormMessage />
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
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Link showArrow={true} openInNewTab={true} className="text-sm">
            Mehr erfahren
          </Link>
        </form>
      </Form>
    </div>
  )
}
