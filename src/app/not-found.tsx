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
import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="max-w-6xl px-4">
        <h1 className="text-3xl font-bold tracking-tighter text-balance mb-2">
          Hier gibt's leider nichts zu sehen.
        </h1>
        <p className="text-lg font-semibold text-muted-foreground text-balance mb-8">
          Die von dir aufgerufene Seite existiert nicht – oder nicht mehr.
          <br />
          Bitte überprüfe den Link oder gehe zurück zur Startseite.
        </p>
        <Button asChild>
          <NextLink href="/">Zur Startseite</NextLink>
        </Button>
      </div>
    </div>
  )
}
