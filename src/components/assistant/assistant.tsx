"use client"

import * as React from "react"

import { ArrowLeft, ArrowRight } from "lucide-react"

import { AlreadyOpenAlert } from "@/components/assistant/already-open-alert"
import { Area, AreaFormRef } from "@/components/assistant/area/area"
import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { Data, DataFormRef } from "@/components/assistant/data/data"
import { Export } from "@/components/assistant/export/export"
import { ModelFormRef } from "@/components/assistant/model/form"
import { Model } from "@/components/assistant/model/model"
import { Resources } from "@/components/assistant/resources/resources"
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
  const { activeStep, setActiveStep } = useAssistantStore()
  const nameIsLoading = useNameStore((state) => state.isLoading)
  const fileIsLoading = useFileStore((state) => state.isLoading)
  const isLoading = nameIsLoading || fileIsLoading
  const modelRef = React.useRef<ModelFormRef>(null)
  const areaRef = React.useRef<AreaFormRef>(null)
  const dataRef = React.useRef<DataFormRef>(null)
  const { isVisible } = useScrollDirection()
  const { isLocked } = useTabLock()

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const getProgressValue = () => {
    switch (activeStep) {
      case "model":
        return 0
      case "area":
        return 20
      case "data":
        return 40
      case "resources":
        return 60
      case "export":
        return 80
      case "summary":
        return 100
      default:
        return 0
    }
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
            setActiveStep("resources")
          }
        }
        break
      case "resources":
        setActiveStep("export")
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
      case "resources":
        setActiveStep("data")
        break
      case "export":
        setActiveStep("resources")
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
        return <Model ref={modelRef} />
      case "area":
        return <Area ref={areaRef} />
      case "data":
        return <Data ref={dataRef} />
      case "resources":
        return <Resources />
      case "export":
        return <Export />
      case "summary":
        return <Summary />
      default:
        return null
    }
  }

  return (
    <div className="@container">
      {isLocked ? <AlreadyOpenAlert /> : <ResumeAlert />}
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
