"use client"

import * as React from "react"

function SummaryHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Zusammenfassung
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        TODO
      </h2>
    </>
  )
}

export function Summary() {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <SummaryHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <SummaryHeadings />
      </div>
    </div>
  )
}
