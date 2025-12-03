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

import { FileCog, Terminal } from "lucide-react"

import { useFileStore } from "@/components/assistant/area/file/store"
import { useNameStore } from "@/components/assistant/area/name/store"
import { useAreaStore } from "@/components/assistant/area/store"
import { parseConfig } from "@/components/assistant/summary/config-parser"
import { NewConfigButton } from "@/components/assistant/summary/new-config-button"
import { OutputDirectoryTree } from "@/components/assistant/summary/output-directory-tree"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"

const RUN_COMMAND_LINUX_MACOS =
  "aviary pipeline run \\\n  pfad/zu/config.yaml \\\n  --log-path pipeline.log"
const RUN_COMMAND_WINDOWS =
  "$params = @(\n" +
  '  "pfad\\zu\\config.yaml",\n' +
  '  "--log-path", "pipeline.log"\n' +
  ")\n" +
  "\n" +
  "aviary pipeline run @params\n"

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

  const activeTab = useAreaStore((state) => state.activeTab)
  const nameGeoJson = useNameStore((state) => state.geoJson)
  const fileGeoJson = useFileStore((state) => state.geoJson)

  const handleDownloadConfig = React.useCallback(() => {
    const blob = new Blob([parsedConfig], { type: "text/yaml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "config.yaml"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [parsedConfig])

  const handleDownloadGeoJson = React.useCallback(() => {
    let geoJson = null as unknown as object | null

    if (activeTab === "name") {
      geoJson = nameGeoJson as unknown as object | null
    } else if (activeTab === "file") {
      geoJson = fileGeoJson as unknown as object | null
    }

    if (!geoJson) return

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], {
      type: "application/geo+json;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "area.geojson"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [activeTab, nameGeoJson, fileGeoJson])

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
          <p className="text-pretty mb-8">
            Hier ist deine Konfiguration – sie definiert alle Schritte der
            Pipeline und kann direkt mit aviary verwendet werden.
          </p>

          <CodeBlock
            title="config.yaml"
            titleIcon={<FileCog aria-hidden="true" />}
            code={parsedConfig}
            language="yaml"
          />

          <p className="text-pretty my-8">
            Lade zuerst die Konfigurationsdatei
            {activeTab === "name" || activeTab === "file"
              ? " und das Gebiet"
              : ""}{" "}
            herunter.
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleDownloadConfig}>Download config.yaml</Button>
            {(activeTab === "name" || activeTab === "file") && (
              <Button
                onClick={handleDownloadGeoJson}
                disabled={activeTab === "name" ? !nameGeoJson : !fileGeoJson}
              >
                Download area.geojson
              </Button>
            )}
          </div>

          <p className="text-pretty my-8">
            Starte die Pipeline mit folgendem Befehl.
          </p>

          <CodeBlock
            title="Terminal"
            titleIcon={<Terminal aria-hidden="true" />}
            code={{
              "Linux und macOS": RUN_COMMAND_LINUX_MACOS,
              Windows: RUN_COMMAND_WINDOWS,
            }}
            language="cli"
          />

          <OutputDirectoryTree />

          <div className="flex justify-center mt-16">
            <NewConfigButton />
          </div>
        </div>
      </div>
    </div>
  )
}
