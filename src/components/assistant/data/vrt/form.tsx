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
          <div className="grid gap-4 grid-cols-1">
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
