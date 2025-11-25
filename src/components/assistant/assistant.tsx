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

import { ArrowLeft, ArrowRight } from "lucide-react"

import {
  Aggregation,
  AggregationFormRef,
} from "@/components/assistant/aggregation/aggregation"
import { AlreadyOpenAlert } from "@/components/assistant/already-open-alert"
import { Area, AreaFormRef } from "@/components/assistant/area/area"
import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { Data, DataFormRef } from "@/components/assistant/data/data"
import { Export } from "@/components/assistant/export/export"
import { ModelFormRef } from "@/components/assistant/model/form"
import { Model } from "@/components/assistant/model/model"
import { Postprocessing } from "@/components/assistant/postprocessing/postprocessing"
import { ResumeAlert } from "@/components/assistant/resume-alert"
import { useAssistantStore } from "@/components/assistant/store"
import { Summary } from "@/components/assistant/summary/summary"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { useTabLock } from "@/hooks/use-tab-lock"
import { cn } from "@/lib/utils"

export function Assistant() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [resetKey, setResetKey] = React.useState(0)
  const { activeStep, setActiveStep } = useAssistantStore()
  const nameIsLoading = useNameStore((state) => state.isLoading)
  const fileIsLoading = useFileStore((state) => state.isLoading)
  const isLoading = nameIsLoading || fileIsLoading
  const modelRef = React.useRef<ModelFormRef>(null)
  const areaRef = React.useRef<AreaFormRef>(null)
  const dataRef = React.useRef<DataFormRef>(null)
  const aggregationRef = React.useRef<AggregationFormRef>(null)
  const { isVisible } = useScrollDirection()
  const { isLocked } = useTabLock()

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const getProgressValue = () => {
    const steps = [
      "model",
      "area",
      "data",
      "postprocessing",
      "aggregation",
      "export",
      "summary",
    ] as const

    const index = steps.indexOf(activeStep as (typeof steps)[number])

    if (index <= 0) return 0
    if (index === steps.length - 1) return 100

    const value = (index / (steps.length - 1)) * 100
    return Math.round(value)
  }

  const handleNext = async () => {
    switch (activeStep) {
      case "model":
        if (modelRef.current) {
          const isValid = await modelRef.current.validate()
          if (isValid) {
            setActiveStep("area")
          }
        }
        break
      case "area":
        if (areaRef.current) {
          const isValid = await areaRef.current.validate()
          if (isValid) {
            setActiveStep("data")
          }
        }
        break
      case "data":
        if (dataRef.current) {
          const isValid = await dataRef.current.validate()
          if (isValid) {
            setActiveStep("postprocessing")
          }
        }
        break
      case "postprocessing":
        setActiveStep("aggregation")
        break
      case "aggregation":
        if (aggregationRef.current) {
          const isValid = await aggregationRef.current.validate()
          if (isValid) {
            setActiveStep("export")
          }
        }
        break
      case "export":
        setActiveStep("summary")
        break
      default:
        break
    }
  }

  const handleBack = () => {
    switch (activeStep) {
      case "area":
        setActiveStep("model")
        break
      case "data":
        setActiveStep("area")
        break
      case "postprocessing":
        setActiveStep("data")
        break
      case "aggregation":
        setActiveStep("postprocessing")
        break
      case "export":
        setActiveStep("aggregation")
        break
      case "summary":
        setActiveStep("export")
        break
      default:
        break
    }
  }

  const renderStep = () => {
    if (!isHydrated) {
      return null
    }

    switch (activeStep) {
      case "model":
        return <Model key={resetKey} ref={modelRef} />
      case "area":
        return <Area ref={areaRef} />
      case "data":
        return <Data ref={dataRef} />
      case "postprocessing":
        return <Postprocessing />
      case "aggregation":
        return <Aggregation ref={aggregationRef} />
      case "export":
        return <Export />
      case "summary":
        return <Summary />
      default:
        return null
    }
  }

  const handleReset = React.useCallback(() => {
    setResetKey((prevKey) => prevKey + 1)
  }, [])

  return (
    <div className="@container">
      {isLocked ? <AlreadyOpenAlert /> : <ResumeAlert onReset={handleReset} />}
      <div
        className={cn(
          "sticky top-13 z-49 -mt-8 pt-4 bg-background transition-all duration-500 transform",
          isVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <div className="flex justify-between items-center gap-4 py-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              disabled={activeStep === "model" || isLoading}
            >
              <ArrowLeft aria-hidden="true" />
              <span className="sr-only">Zurück</span>
            </Button>

            <div className="flex-1 max-w-64 mx-4">
              <Progress value={getProgressValue()} />
            </div>

            <Button
              size="icon"
              onClick={handleNext}
              disabled={activeStep === "summary" || isLoading}
              className={cn(activeStep === "model" && "animate-throb")}
            >
              <ArrowRight aria-hidden="true" />
              <span className="sr-only">Weiter</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8">{renderStep()}</div>
    </div>
  )
}
