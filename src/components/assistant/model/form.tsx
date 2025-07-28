"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Check } from "lucide-react"

import {
  type ModelFormSchema,
  modelFormSchema,
} from "@/components/assistant/model/schema"
import { useModelStore } from "@/components/assistant/model/store"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"

export interface ModelFormRef {
  validate: () => Promise<boolean>
}

export const ModelForm = React.forwardRef<ModelFormRef>(
  function ModelForm(_, ref) {
    const { formValues, setFormValues } = useModelStore()

    const form = useForm<ModelFormSchema>({
      resolver: zodResolver(modelFormSchema),
      defaultValues: formValues || {
        model1: false,
        model2: false,
        root: undefined,
      },
      mode: "onSubmit",
      reValidateMode: "onSubmit",
    })

    const validateForm = React.useCallback(async () => {
      return await form.trigger()
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
              findest du <Link showUnderline={true}>hier</Link>.
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
                          "p-4 h-auto text-left flex flex-col items-start",
                          {
                            "border-primary dark:border-primary": field.value,
                          },
                        )}
                        onClick={() => field.onChange(!field.value)}
                        aria-pressed={field.value}
                        aria-label="model-1 auswählen"
                      >
                        <div className="w-full flex justify-between items-center">
                          <h3 className="text-base">model-1</h3>
                          {field.value && (
                            <>
                              <Check
                                className="text-success"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                model-1 ausgewählt
                              </span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 font-normal text-muted-foreground text-pretty">
                          Lorem ipsum dolor sit amet, consetetur sadipscing
                          elitr, sed diam nonumy eirmod tempor invidunt ut
                          labore et dolore magna aliquyam erat, sed diam
                          voluptua.
                        </p>
                        <Link showArrow={true} className="font-normal">
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
                          "p-4 h-auto text-left flex flex-col items-start",
                          {
                            "border-primary dark:border-primary": field.value,
                          },
                        )}
                        onClick={() => field.onChange(!field.value)}
                        aria-pressed={field.value}
                        aria-label="model-2 auswählen"
                      >
                        <div className="w-full flex justify-between items-center">
                          <h3 className="text-base">model-2</h3>
                          {field.value && (
                            <>
                              <Check
                                className="text-success"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                model-2 ausgewählt
                              </span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 font-normal text-muted-foreground text-pretty">
                          Lorem ipsum dolor sit amet, consetetur sadipscing
                          elitr, sed diam nonumy eirmod tempor invidunt ut
                          labore et dolore magna aliquyam erat, sed diam
                          voluptua.
                        </p>
                        <Link showArrow={true} className="font-normal">
                          Mehr erfahren
                        </Link>
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="root"
              render={() => (
                <FormItem>
                  <div className="min-h-[1.25rem] mt-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Link showArrow={true} className="text-sm">
              Mehr erfahren
            </Link>
          </form>
        </Form>
      </div>
    )
  },
)
