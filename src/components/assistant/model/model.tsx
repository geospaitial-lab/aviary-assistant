"use client"

import * as React from "react"

import { ModelForm, ModelFormRef } from "@/components/assistant/model/form"

function ModelHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Was soll erkannt werden?
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Wähle die Modelle, die zur Auswertung verwendet werden sollen
      </h2>
    </>
  )
}

export const Model = React.forwardRef<ModelFormRef>(function Model(_, ref) {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const formRef = React.useRef<React.ComponentRef<typeof ModelForm>>(null)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const validateForm = React.useCallback(async () => {
    if (formRef.current) {
      return await formRef.current.validate()
    }
    return false
  }, [formRef])

  React.useImperativeHandle(
    ref,
    () => ({
      validate: validateForm,
    }),
    [validateForm],
  )

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <ModelHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <ModelHeadings />

        <div className="p-4 border-2 rounded-lg">
          <ModelForm ref={formRef} />
        </div>
      </div>
    </div>
  )
})
