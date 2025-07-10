"use client"

import * as React from "react"

import { Cpu } from "@/components/assistant/resources/cpu"
import { Gpu } from "@/components/assistant/resources/gpu"
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
        <div>
          <div className="text-2xl font-bold text-center mb-2">
            Womit willst du rechnen?
          </div>

          <div className="font-medium text-muted-foreground text-center mb-8">
            Wähle die Hardware, auf der unsere KI laufen soll – CPU oder GPU.
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="cpu">CPU</TabsTrigger>
              <TabsTrigger value="gpu">GPU</TabsTrigger>
            </TabsList>

            <TabsContent value="cpu">
              <div className="p-4 border rounded-lg">
                <Cpu />
              </div>
            </TabsContent>

            <TabsContent value="gpu">
              <div className="p-4 border rounded-lg">
                <Gpu />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
