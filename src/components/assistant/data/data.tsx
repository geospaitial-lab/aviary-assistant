"use client"

import * as React from "react"

import { Plus } from "lucide-react"
import { toast } from "sonner"

import { AddDataSourceDialog } from "@/components/assistant/data/add-data-source-dialog"
import { ChannelsBadge, TypeBadge } from "@/components/assistant/data/badges"
import { GlobalForm } from "@/components/assistant/data/global/form"
import { DataSource, useDataStore } from "@/components/assistant/data/store"
import { VrtForm, VrtFormRef } from "@/components/assistant/data/vrt/form"
import { WmsForm, WmsFormRef } from "@/components/assistant/data/wms/form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const ERROR_DATA = "Wähle mindestens eine Datenquelle"

export interface DataFormRef {
  validate: () => Promise<boolean>
}

function DataHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Woher kommen die Daten?
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Wähle die Datenquellen, die die Luftbilder enthalten
      </h2>
    </>
  )
}

interface DataSourceItemProps {
  dataSource: DataSource
  formRef: React.RefObject<WmsFormRef | VrtFormRef | null>
  index: number
}

function DataSourceItem({ dataSource, formRef, index }: DataSourceItemProps) {
  const { removeDataSource } = useDataStore()

  return (
    <div className="mb-4">
      <div className="p-4 border rounded-md">
        <div className="grid gap-4">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Label>Datenquelle {index + 1}</Label>
              <ChannelsBadge
                channels={
                  dataSource.channels.toLowerCase() as
                    | "rgb"
                    | "cir"
                    | "nir"
                    | "rgbi"
                    | "dom"
                }
              />
              <TypeBadge type={dataSource.type} />
            </div>
          </div>
          {dataSource.type === "wms" ? (
            <WmsForm
              ref={formRef as React.RefObject<WmsFormRef>}
              dataSourceId={dataSource.id}
            />
          ) : (
            <VrtForm
              ref={formRef as React.RefObject<VrtFormRef>}
              dataSourceId={dataSource.id}
            />
          )}
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeDataSource(dataSource.id)}
              className="w-24"
            >
              Entfernen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Data = React.forwardRef<DataFormRef>(function Data(_, ref) {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const { dataSources, addDataSource } = useDataStore()

  const formRefs = React.useRef<
    Map<string, React.RefObject<WmsFormRef | VrtFormRef | null>>
  >(new Map())

  dataSources.forEach((ds) => {
    if (!formRefs.current.has(ds.id)) {
      formRefs.current.set(ds.id, React.createRef<WmsFormRef | VrtFormRef>())
    }
  })

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const validateForm = React.useCallback(async () => {
    if (dataSources.length === 0) {
      toast.error(ERROR_DATA)
      return false
    }

    const validationResults = await Promise.all(
      dataSources.map(async (ds) => {
        const ref = formRefs.current.get(ds.id)
        if (ref && ref.current) {
          return await ref.current.validate()
        }
        return false
      }),
    )

    return validationResults.every(Boolean)
  }, [dataSources])

  React.useImperativeHandle(
    ref,
    () => ({
      validate: validateForm,
    }),
    [validateForm],
  )

  const shouldShowAddButton = React.useMemo(() => {
    const hasRgbi = dataSources.some((ds) => ds.channels === "rgbi")
    const hasDom = dataSources.some((ds) => ds.channels === "dom")

    return dataSources.length < 3 && !(hasRgbi && hasDom)
  }, [dataSources])

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

        <div className="p-4 border-2 rounded-lg">
          <GlobalForm />

          <div className="mt-8">
            <Label className="mb-4">Datenquellen</Label>

            {dataSources.map((dataSource, index) => (
              <DataSourceItem
                key={dataSource.id}
                dataSource={dataSource}
                formRef={
                  formRefs.current.get(dataSource.id) ||
                  React.createRef<WmsFormRef | VrtFormRef>()
                }
                index={index}
              />
            ))}

            {shouldShowAddButton && (
              <div className="flex justify-center w-full">
                <Button onClick={() => setDialogOpen(true)} size="icon">
                  <Plus />
                </Button>
              </div>
            )}
          </div>

          <AddDataSourceDialog
            open={dialogOpen}
            onOpenChangeAction={setDialogOpen}
            onAddAction={addDataSource}
          />
        </div>
      </div>
    </div>
  )
})
