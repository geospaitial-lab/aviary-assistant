"use client"

import * as React from "react"

import { ArrowLeft, ArrowRight } from "lucide-react"

import { Area, AreaFormRef } from "@/components/assistant/area/area"
import { Data } from "@/components/assistant/data/data"
import { Export } from "@/components/assistant/export/export"
import { ModelFormRef } from "@/components/assistant/model/form"
import { Model } from "@/components/assistant/model/model"
import { Resources } from "@/components/assistant/resources/resources"
import { ResumeAlert } from "@/components/assistant/resume-alert"
import { useAssistantStore } from "@/components/assistant/store"
import { Summary } from "@/components/assistant/summary/summary"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function Assistant() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeStep, setActiveStep } = useAssistantStore()
  const modelRef = React.useRef<ModelFormRef>(null)
  const areaRef = React.useRef<AreaFormRef>(null)

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
        setActiveStep("resources")
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
        return <Data />
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
      <ResumeAlert />
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            disabled={activeStep === "model"}
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
            disabled={activeStep === "summary"}
            className={cn(activeStep === "model" && "animate-throb")}
          >
            <ArrowRight aria-hidden="true" />
            <span className="sr-only">Weiter</span>
          </Button>
        </div>
      </div>
      <div className="mt-8">{renderStep()}</div>
    </div>
  )
}
