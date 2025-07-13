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
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
          Wohin mit den Ergebnissen?
        </h1>

        <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance  mb-8">
          Wähle den Ort, an dem die Ausgabe unserer KI gespeichert werden soll
        </h2>

        <div className="p-4 border-2 rounded-lg">
          <ExportForm />
        </div>
      </div>
    </div>
  )
}
