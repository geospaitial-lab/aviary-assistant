"use client"

import * as React from "react"

import { CpuForm } from "@/components/assistant/resources/cpu/form"
import { GpuForm } from "@/components/assistant/resources/gpu/form"
import { useResourcesStore } from "@/components/assistant/resources/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Resources() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeTab, setActiveTab } = useResourcesStore()

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  return (
    <div className="@container">
      <div className="@2xl:w-1/2 @2xl:mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-2">
          Womit willst du rechnen?
        </h1>

        <h2 className="font-semibold text-muted-foreground text-center mb-8">
          Wähle die Hardware, auf der unsere KI laufen soll – CPU oder GPU.
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="gpu">GPU</TabsTrigger>
          </TabsList>

          <TabsContent value="cpu">
            <div className="p-4 border rounded-lg">
              <CpuForm />
            </div>
          </TabsContent>

          <TabsContent value="gpu">
            <div className="p-4 border rounded-lg">
              <GpuForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
