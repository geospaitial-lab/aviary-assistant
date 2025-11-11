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

import { CpuForm } from "@/components/assistant/resources/cpu/form"
import { GpuForm } from "@/components/assistant/resources/gpu/form"
import { useResourcesStore } from "@/components/assistant/resources/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function ResourcesHeadings() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter text-center text-balance mb-2">
        Womit willst du rechnen?
      </h1>

      <h2 className="text-lg font-semibold text-muted-foreground text-center text-balance mb-8">
        Wähle die Hardware, auf der unsere KI laufen soll – CPU oder GPU
      </h2>
    </>
  )
}

export function Resources() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const { activeTab, setActiveTab } = useResourcesStore()

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="@container">
        <div className="@2xl:w-2/3 @2xl:mx-auto">
          <ResourcesHeadings />
        </div>
      </div>
    )
  }

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <ResourcesHeadings />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="gpu">GPU</TabsTrigger>
          </TabsList>

          <TabsContent value="cpu">
            <div className="p-4 border-2 rounded-lg">
              <CpuForm />
            </div>
          </TabsContent>

          <TabsContent value="gpu">
            <div className="p-4 border-2 rounded-lg">
              <GpuForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
