"use client"

import * as React from "react"

import { ModelForm } from "@/components/assistant/model/form"
import { Button } from "@/components/ui/button"

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

export function Model() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const formRef = React.useRef<React.ComponentRef<typeof ModelForm>>(null)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleNextClick = async () => {
    if (formRef.current) {
      const valid = await formRef.current.validate()
    }
  }

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

        <div className="mt-4 flex justify-end">
          <Button onClick={handleNextClick}>Weiter</Button>
        </div>
      </div>
    </div>
  )
}
