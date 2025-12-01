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
import { ArrowDown } from "lucide-react"

import { Link } from "@/components/link"

export function WieEsFunktioniert() {
  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">
          Wie es funktioniert
        </h2>

        <div className="text-lg font-semibold text-muted-foreground mb-8">
          <p>
            aviary ist ein Framework, mit dem man Luftbilder mit KI auswerten
            kann.
            <br />
            Der Assistant nimmt dir die Einrichtung ab – er erstellt die
            Konfigurationsdatei für die Pipeline automatisch anhand deiner
            Angaben.
          </p>
        </div>

        <ol className="space-y-4 list-none">
          <li className="p-4 border rounded-md">
            <div className="font-semibold">Assistant verwenden</div>
            <p className="text-sm text-muted-foreground">
              Starte den Assistant und beantworte ein paar kurze Fragen. Am Ende
              bekommst du eine entsprechende Konfigurationsdatei, in der alle
              nötigen Schritte deiner Pipeline beschrieben sind.
            </p>
          </li>
          <li aria-hidden="true" className="flex justify-center">
            <ArrowDown className="text-muted-foreground" aria-hidden="true" />
          </li>
          <li className="p-4 border rounded-md">
            <div className="font-semibold">aviary installieren</div>
            <p className="text-sm text-muted-foreground">
              Installiere das Framework auf deiner Maschine. Eine Anleitung
              findest du{" "}
              <Link
                href="/anleitungen"
                showArrow={true}
                openInNewTab={true}
                className="hover:text-foreground"
              >
                hier
              </Link>
              .
            </p>
          </li>
          <li aria-hidden="true" className="flex justify-center">
            <ArrowDown className="text-muted-foreground" aria-hidden="true" />
          </li>
          <li className="p-4 border rounded-md">
            <div className="font-semibold">Pipeline starten</div>
            <p className="text-sm text-muted-foreground">
              Führe die Pipeline mit der Konfigurationsdatei auf deiner Maschine
              aus. Am Ende bekommst du .gpkg-Dateien mit den Ergebnissen unserer
              KI.
            </p>
          </li>
        </ol>
      </div>
    </div>
  )
}
