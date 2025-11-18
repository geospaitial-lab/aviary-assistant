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

import { parseConfig } from "@/components/assistant/summary/config-parser"
import { NewConfigButton } from "@/components/assistant/summary/new-config-button"
import { CodeBlock } from "@/components/code-block"

function SummaryHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Du hast es geschafft!
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Lade die Konfiguration herunter und starte die Pipeline
      </h2>
    </>
  )
}

export function Summary() {
  const [isHydrated, setIsHydrated] = React.useState(false)

  const parsedConfig = React.useMemo(() => {
    return parseConfig()
  }, [])

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <SummaryHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <SummaryHeadings />

        <div className="p-4 border-2 rounded-lg">
          <CodeBlock title="config.yaml" code={parsedConfig} language="yaml" />

          <div className="mt-4 flex justify-center">
            <NewConfigButton />
          </div>
        </div>
      </div>
    </div>
  )
}
