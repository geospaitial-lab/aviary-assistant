"use client"

import * as React from "react"

import { ExportForm } from "@/components/assistant/export/form"

export function Export() {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  return (
    <div className="@container">
      <div className="@2xl:w-1/2 @2xl:mx-auto ">
        <ExportForm />
      </div>
    </div>
  )
}
