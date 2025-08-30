"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { toast } from "sonner"

import { useDataStore } from "@/components/assistant/data/store"
import {
  type VrtFormSchema,
  vrtFormSchema,
} from "@/components/assistant/data/vrt/schema"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"

const ERROR_VRT = "Die Datenquelle ist nicht richtig konfiguriert"

export interface VrtFormRef {
  validate: () => Promise<boolean>
}

interface VrtFormProps {
  dataSourceId: string
}

export const VrtForm = React.forwardRef<VrtFormRef, VrtFormProps>(
  function VrtForm({ dataSourceId }, ref) {
    const { dataSources, updateDataSource } = useDataStore()
    const dataSource = dataSources.find((ds) => ds.id === dataSourceId)
    const formValues = dataSource?.formValues as VrtFormSchema | null

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
        updateDataSource(dataSourceId, value as VrtFormSchema)
      })
      return () => subscription.unsubscribe()
    }, [form, updateDataSource, dataSourceId])

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
                    <FormDescription>Pfad zur .vrt-Datei</FormDescription>
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
