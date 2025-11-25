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

import { Check } from "lucide-react"
import { toast } from "sonner"

import {
  type ModelFormSchema,
  modelFormSchema,
} from "@/components/assistant/model/schema"
import { useModelStore } from "@/components/assistant/model/store"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"

const ERROR_MODEL = "Wähle mindestens ein Modell"

export interface ModelFormRef {
  validate: () => Promise<boolean>
}

export const ModelForm = React.forwardRef<ModelFormRef>(
  function ModelForm(_, ref) {
    const { formValues, setFormValues } = useModelStore()

    const form = useForm<ModelFormSchema>({
      resolver: zodResolver(modelFormSchema),
      defaultValues: formValues,
      mode: "onSubmit",
      reValidateMode: "onSubmit",
    })

    const validateForm = React.useCallback(async () => {
      return new Promise<boolean>((resolve) => {
        form.trigger().then((isValid) => {
          if (!isValid) {
            if (!form.getValues().model1 && !form.getValues().model2) {
              toast.error(ERROR_MODEL)
            }
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
        setFormValues(value as ModelFormSchema)
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
            <p className="text-pretty mb-4">
              Gib hier an, mit welchen Modellen du deine Daten auswerten
              möchtest – welches Modell du für deinen Anwendungsfall brauchst,
              findest du{" "}
              <Link showUnderline={true} openInNewTab={true}>
                hier
              </Link>
              .
            </p>

            <div className="grid gap-4 grid-cols-1 @lg:grid-cols-2">
              <FormField
                control={form.control}
                name="model1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "p-4 h-auto text-left flex flex-col items-start justify-start",
                          {
                            "border-primary dark:border-primary": field.value,
                          },
                        )}
                        onClick={() => field.onChange(!field.value)}
                        aria-pressed={field.value}
                        aria-label="sursentia-landcover auswählen"
                      >
                        <div className="w-full flex justify-between items-center">
                          <h3 className="text-base">sursentia-landcover</h3>
                          {field.value && (
                            <>
                              <Check
                                className="text-success"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                sursentia-landcover ausgewählt
                              </span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 font-normal text-muted-foreground text-pretty whitespace-normal">
                          Erkennt Gebäude, Gründächer, versiegelte Flächen,
                          nicht versiegelte Flächen und Gewässer.
                        </p>
                        <Link
                          showArrow={true}
                          openInNewTab={true}
                          className="font-normal"
                        >
                          Mehr erfahren
                        </Link>
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "p-4 h-auto text-left flex flex-col items-start justify-start",
                          {
                            "border-primary dark:border-primary": field.value,
                          },
                        )}
                        onClick={() => field.onChange(!field.value)}
                        aria-pressed={field.value}
                        aria-label="sursentia-solar auswählen"
                      >
                        <div className="w-full flex justify-between items-center">
                          <h3 className="text-base">sursentia-solar</h3>
                          {field.value && (
                            <>
                              <Check
                                className="text-success"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                sursentia-solar ausgewählt
                              </span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 font-normal text-muted-foreground text-pretty whitespace-normal">
                          Erkennt Solaranlagen.
                        </p>
                        <Link
                          showArrow={true}
                          openInNewTab={true}
                          className="font-normal"
                        >
                          Mehr erfahren
                        </Link>
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Link
              href="/faq#modelle"
              showArrow={true}
              openInNewTab={true}
              className="text-sm mt-4"
            >
              Mehr erfahren
            </Link>
          </form>
        </Form>
      </div>
    )
  },
)
