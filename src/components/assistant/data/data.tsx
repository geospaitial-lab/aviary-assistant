"use client"

import * as React from "react"

import { useDataStore } from "@/components/assistant/data/store"
import { VrtForm, VrtFormRef } from "@/components/assistant/data/vrt/form"
import { WmsForm, WmsFormRef } from "@/components/assistant/data/wms/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface DataFormRef {
  validate: () => Promise<boolean>
}

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

export const Data = React.forwardRef<DataFormRef>(function Data(_, ref) {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeTab, setActiveTab } = useDataStore()
  const wmsFormRef = React.useRef<WmsFormRef>(null)
  const vrtFormRef = React.useRef<VrtFormRef>(null)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const validateForm = React.useCallback(async () => {
    if (activeTab === "wms" && wmsFormRef.current) {
      return await wmsFormRef.current.validate()
    } else if (activeTab === "vrt" && vrtFormRef.current) {
      return await vrtFormRef.current.validate()
    }
    return false
  }, [activeTab])

  React.useImperativeHandle(
    ref,
    () => ({
      validate: validateForm,
    }),
    [validateForm],
  )

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

          <TabsContent value="wms">
            <div className="p-4 border-2 rounded-lg">
              <WmsForm ref={wmsFormRef} />
            </div>
          </TabsContent>

          <TabsContent value="vrt">
            <div className="p-4 border-2 rounded-lg">
              <VrtForm ref={vrtFormRef} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
})
