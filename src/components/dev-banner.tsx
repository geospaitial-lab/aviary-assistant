"use client"

import * as React from "react"

import { X } from "lucide-react"

import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"

export function DevBanner() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const hasSeenBanner = localStorage.getItem("devBannerSeen")

    if (!hasSeenBanner) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("devBannerSeen", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="w-full text-background bg-foreground py-2 relative">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 text-xs text-balance text-center sm:text-left">
          <p>
            Im Rahmen von{" "}
            <Link href="https://urban-ki.de" showArrow={true}>
              URBAN.KI
            </Link>{" "}
            entsteht ein Assistant zur Konfiguration von{" "}
            <Link
              href="https://github.com/geospaitial-lab/aviary"
              showArrow={true}
            >
              aviary
            </Link>
            . Die Entwicklung ist noch nicht abgeschlossen – danke für die
            Geduld!
          </p>
        </div>
        <Button variant="default" size="icon" onClick={handleClose}>
          <X aria-hidden="true" />
          <span className="sr-only">Schließen</span>
        </Button>
      </div>
    </div>
  )
}
