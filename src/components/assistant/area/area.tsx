"use client"

import * as React from "react"

import { BoundingBoxForm } from "@/components/assistant/area/bounding-box/form"
import { FileForm } from "@/components/assistant/area/file/form"
import { Map } from "@/components/assistant/area/map/map"
import { NameForm } from "@/components/assistant/area/name/form"
import { useAreaStore } from "@/components/assistant/area/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Area() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeTab, setActiveTab } = useAreaStore()

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  return (
    <div className="@container">
      <div className="flex flex-col @2xl:flex-row gap-4">
        <div className="order-2 @2xl:order-1 @2xl:w-1/2 aspect-square">
          <Map />
        </div>

        <div className="flex-1 order-1 @2xl:order-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="name">Name</TabsTrigger>
              <TabsTrigger value="file">Datei</TabsTrigger>
              <TabsTrigger value="bounding-box">Bounding Box</TabsTrigger>
              <TabsTrigger value="draw">Zeichnen</TabsTrigger>
            </TabsList>

            <TabsContent value="name">
              <div className="p-4 border rounded-lg">
                <NameForm />
              </div>
            </TabsContent>

            <TabsContent value="file">
              <div className="p-4 border rounded-lg">
                <FileForm />
              </div>
            </TabsContent>

            <TabsContent value="bounding-box">
              <div className="p-4 border rounded-lg">
                <BoundingBoxForm />
              </div>
            </TabsContent>

            <TabsContent value="draw">
              <div className="p-4 border rounded-lg">
                <p>TODO</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
