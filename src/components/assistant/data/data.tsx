"use client"

import * as React from "react"

import { useDataStore } from "@/components/assistant/data/store"
import { VrtForm } from "@/components/assistant/data/vrt/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function DataHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Daten
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        TODO
      </h2>
    </>
  )
}

export function Data() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeTab, setActiveTab } = useDataStore()

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <DataHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <DataHeadings />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="wms">WMS</TabsTrigger>
            <TabsTrigger value="vrt">VRT</TabsTrigger>
          </TabsList>

          <TabsContent value="vrt">
            <div className="p-4 border-2 rounded-lg">
              <VrtForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
