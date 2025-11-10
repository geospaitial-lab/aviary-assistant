"use client"

import * as React from "react"

import { toast } from "sonner"

import { BoundingBoxForm } from "@/components/assistant/area/bounding-box/form"
import { useBoundingBoxStore } from "@/components/assistant/area/bounding-box/store"
import { FileForm } from "@/components/assistant/area/file/form"
import { useFileStore } from "@/components/assistant/area/file/store"
import { Map } from "@/components/assistant/area/map/map"
import { NameForm } from "@/components/assistant/area/name/form"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AllGeoJSON } from "@turf/helpers"

const ERROR_AREA = "Wähle ein Gebiet"

function AreaHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Welches Gebiet interessiert dich?
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Wähle das Gebiet, das von unserer KI ausgewertet werden soll
      </h2>
    </>
  )
}

export interface AreaFormRef {
  validate: () => Promise<boolean>
}

export const Area = React.forwardRef<AreaFormRef>(function Area(_, ref) {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeTab, setActiveTab } = useAreaStore()
  const nameGeoJson = useNameStore((state) => state.geoJson)
  const fileGeoJson = useFileStore((state) => state.geoJson)
  const boundingBoxGeoJson = useBoundingBoxStore((state) => state.geoJson)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const getCurrentGeoJson = React.useCallback((): AllGeoJSON | null => {
    switch (activeTab) {
      case "name":
        return nameGeoJson
      case "file":
        return fileGeoJson
      case "bounding-box":
        return boundingBoxGeoJson
      default:
        return null
    }
  }, [activeTab, nameGeoJson, fileGeoJson, boundingBoxGeoJson])

  const validateArea = React.useCallback(async (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const currentGeoJson = getCurrentGeoJson()
      const isValid = currentGeoJson !== null

      if (!isValid) {
        toast.error(ERROR_AREA)
      }
      resolve(isValid)
    })
  }, [getCurrentGeoJson])

  React.useImperativeHandle(
    ref,
    () => ({
      validate: validateArea,
    }),
    [validateArea],
  )

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <AreaHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <AreaHeadings />
      </div>

      <div className="flex flex-col @2xl:flex-row gap-4">
        <div className="order-2 @2xl:order-1 @2xl:w-1/2">
          <div className="aspect-square">
            <Map />
          </div>
        </div>

        <div className="flex-1 order-1 @2xl:order-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="name">Name</TabsTrigger>
              <TabsTrigger value="file">Datei</TabsTrigger>
              <TabsTrigger value="bounding-box">Bounding Box</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </div>
  )
})
