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

import { ArrowRight } from "lucide-react"
import NextLink from "next/link"

import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"

export function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const imageSrc = `${basePath}/images/sursentia_gelsenkirchen.webp`

  return (
    <div className="@container">
      <div className="flex flex-col @2xl:flex-row @2xl:items-center gap-4 mt-2">
        <div className="order-2 @2xl:order-1 @2xl:w-1/2">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg">
            <img
              src={imageSrc}
              alt="Sursentia-Gelsenkirchen"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="flex-1 order-1 @2xl:order-2">
          <h1 className="text-3xl font-bold tracking-tighter text-pretty mb-8">
            Erkenne versiegelte Flächen, Gründächer und Solaranlagen deiner
            Kommune.
          </h1>

          <div className="flex flex-col items-center @2xl:items-start gap-4 mb-8">
            <Button asChild className={"w-48"}>
              <NextLink href="/assistant">
                <div className="flex items-center gap-1">
                  <span>Starte den Assistant</span>
                  <ArrowRight aria-hidden="true" />
                </div>
              </NextLink>
            </Button>

            <Button asChild variant={"outline"} className={"w-48"}>
              <NextLink href="/wie-es-funktioniert">
                <div className="flex items-center gap-1">
                  <span>Wie es funktioniert</span>
                  <ArrowRight aria-hidden="true" />
                </div>
              </NextLink>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-pretty mb-4">
            Die Sursentia-Modelle, der Assistant und aviary wurden im Rahmen von{" "}
            <Link
              href="https://www.linkedin.com/company/urban-ki"
              showArrow={true}
              openInNewTab={true}
              className="hover:text-foreground"
            >
              URBAN.KI
            </Link>{" "}
            – der deutschen KI-Initiative für Kommunen – entwickelt und allen
            Kommunen in Deutschland bereitgestellt.
          </p>
        </div>
      </div>
    </div>
  )
}
