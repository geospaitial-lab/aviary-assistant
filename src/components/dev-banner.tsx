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
