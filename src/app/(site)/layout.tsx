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

import { CircleX } from "lucide-react"

import "@/app/globals.css"
import { DevBanner } from "@/components/dev-banner"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster
        icons={{
          error: (
            <CircleX className="size-4 text-destructive" aria-hidden="true" />
          ),
        }}
      />
      <DevBanner />
      <Header />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 mb-32">{children}</main>
      </div>
      <Footer />
    </>
  )
}
