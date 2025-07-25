"use client"

import * as React from "react"

import { CpuForm } from "@/components/assistant/resources/cpu/form"
import { GpuForm } from "@/components/assistant/resources/gpu/form"
import { useResourcesStore } from "@/components/assistant/resources/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function ResourcesHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Womit willst du rechnen?
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Wähle die Hardware, auf der unsere KI laufen soll – CPU oder GPU
      </h2>
    </>
  )
}

export function Resources() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeTab, setActiveTab } = useResourcesStore()

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <ResourcesHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <ResourcesHeadings />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="gpu">GPU</TabsTrigger>
          </TabsList>

          <TabsContent value="cpu">
            <div className="p-4 border-2 rounded-lg">
              <CpuForm />
            </div>
          </TabsContent>

          <TabsContent value="gpu">
            <div className="p-4 border-2 rounded-lg">
              <GpuForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
