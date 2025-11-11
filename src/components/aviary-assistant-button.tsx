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

import { AviaryIcon } from "@/components/aviary-icon"
import { Button } from "@/components/ui/button"

export function AviaryAssistantButton() {
  return (
    <Button asChild variant="link">
      <NextLink href="/">
        <AviaryIcon className="size-10 text-foreground" aria-hidden="true" />
        <span className="sr-only">Startseite</span>
      </NextLink>
    </Button>
  )
}
