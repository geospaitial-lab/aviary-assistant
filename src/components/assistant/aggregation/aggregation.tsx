"use client"

/*
 * Copyright (C) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import * as React from "react"

import { Plus } from "lucide-react"
import { toast } from "sonner"

import {
  GpkgForm,
  GpkgFormRef,
} from "@/components/assistant/aggregation/gpkg/form"
import { useAggregationStore } from "@/components/assistant/aggregation/store"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const ERROR_PATHS = "Die Pfade müssen unterschiedlich sein"
const ERROR_NAMES = "Die Namen müssen unterschiedlich sein"

export interface AggregationFormRef {
  validate: () => Promise<boolean>
}

function AggregationHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Worauf soll aggregiert werden?
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Wähle die Aggregationsquellen, für die Statistiken berechnet werden
        sollen
      </h2>
    </>
  )
}

interface AggregationSourceItemProps {
  aggregationSourceId: string
  formRef: React.RefObject<GpkgFormRef | null>
  index: number
}

function AggregationSourceItem({
  aggregationSourceId,
  formRef,
  index,
}: AggregationSourceItemProps) {
  const { removeAggregationSource } = useAggregationStore()

  return (
    <div className="mb-4">
      <div className="p-4 border rounded-md">
        <div className="grid gap-4">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Label>Aggregationsquelle {index + 1}</Label>
            </div>
          </div>
          <GpkgForm
            ref={formRef as React.RefObject<GpkgFormRef>}
            aggregationSourceId={aggregationSourceId}
          />
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeAggregationSource(aggregationSourceId)}
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

export const Aggregation = React.forwardRef<AggregationFormRef>(
  function Aggregation(_, ref) {
    const [isHydrated, setIsHydrated] = React.useState(false)
    const { aggregationSources, addAggregationSource } = useAggregationStore()

    const formRefs = React.useRef<
      Map<string, React.RefObject<GpkgFormRef | null>>
    >(new Map())

    aggregationSources.forEach((as) => {
      if (!formRefs.current.has(as.id)) {
        formRefs.current.set(as.id, React.createRef<GpkgFormRef>())
      }
    })

    React.useEffect(() => {
      setIsHydrated(true)
    }, [])

    const validateForm = React.useCallback(async () => {
      if (aggregationSources.length === 0) {
        return true
      }

      const validationResults = await Promise.all(
        aggregationSources.map(async (as) => {
          const ref = formRefs.current.get(as.id)
          if (ref && ref.current) {
            return await ref.current.validate()
          }
          return false
        }),
      )

      if (!validationResults.every(Boolean)) {
        return false
      }

      const names = aggregationSources.map(
        (as) => as.formValues?.name?.trim().toLowerCase() || "",
      )
      const paths = aggregationSources
        .map((as) => (as.formValues?.path || "").trim().toLowerCase())
        .filter((path) => path.length > 0)

      const hasDuplicate = (arr: string[]) => {
        const normalized = arr.filter((v) => v.length > 0)
        return new Set(normalized).size !== normalized.length
      }

      if (hasDuplicate(names)) {
        toast.error(ERROR_NAMES)
        return false
      }

      if (hasDuplicate(paths)) {
        toast.error(ERROR_PATHS)
        return false
      }

      return true
    }, [aggregationSources])

    React.useImperativeHandle(
      ref,
      () => ({
        validate: validateForm,
      }),
      [validateForm],
    )

    const shouldShowAddButton = React.useMemo(
      () => aggregationSources.length < 3,
      [aggregationSources],
    )

    if (!isHydrated) {
      return (
        <div className="@container">
          <div className="@2xl:w-2/3 @2xl:mx-auto">
            <AggregationHeadings />
          </div>
        </div>
      )
    }

    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <AggregationHeadings />

          <div className="p-4 border-2 rounded-lg">
            <p className="text-pretty mb-4">
              Wähle bis zu drei Aggregationsquellen. Es werden für jedes Polygon
              Statistiken berechnet – das sind konkret die absoluten und
              relativen Flächen der Ergebnisse.
              <br />
              Du kannst so beispielsweise Flurstücke mit diesen Attributen
              anreichern.
            </p>

            <Label className="mb-4">Aggregationsquellen</Label>

            {aggregationSources.map((aggregationSource, index) => (
              <AggregationSourceItem
                key={aggregationSource.id}
                aggregationSourceId={aggregationSource.id}
                formRef={
                  formRefs.current.get(aggregationSource.id) ||
                  React.createRef<GpkgFormRef>()
                }
                index={index}
              />
            ))}

            {shouldShowAddButton && (
              <div className="flex justify-center w-full">
                <Button
                  onClick={() => addAggregationSource()}
                  aria-label="Aggregationsquelle hinzufügen"
                  size="icon"
                >
                  <Plus />
                </Button>
              </div>
            )}

            <Link
              href="/faq#aggregierung"
              showArrow={true}
              openInNewTab={true}
              className="text-sm mt-4"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </div>
    )
  },
)
