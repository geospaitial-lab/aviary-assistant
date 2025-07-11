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
      <div className="@2xl:w-1/2 @2xl:mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-2">
          Welches Gebiet?
        </h1>

        <h2 className="font-semibold text-muted-foreground text-center mb-8">
          Wähle das Gebiet, das von unserer KI ausgewertet werden soll
        </h2>
      </div>
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
              <div className="p-4 border-2 rounded-lg">
                <NameForm />
              </div>
            </TabsContent>

            <TabsContent value="file">
              <div className="p-4 border-2 rounded-lg">
                <FileForm />
              </div>
            </TabsContent>

            <TabsContent value="bounding-box">
              <div className="p-4 border-2 rounded-lg">
                <BoundingBoxForm />
              </div>
            </TabsContent>

            <TabsContent value="draw">
              <div className="p-4 border-2 rounded-lg">
                <p>TODO</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
