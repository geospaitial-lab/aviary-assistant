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
import { Link } from "@/components/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AreaFaq() {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tighter mb-2" id="gebiet">
        Gebiet
      </h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Wie groß kann ein Gebiet sein?</AccordionTrigger>
          <AccordionContent>
            Große Gebiete ({`>`} 1000 km²) funktionieren ebenso wie kleine – die
            Laufzeit verlängert sich entsprechend.
            <br />
            Falls du mehrere Maschinen hast, kannst du das Gebiet in Chunks
            zerlegen (siehe{" "}
            <Link
              href="https://geospaitial-lab.github.io/aviary/api_reference/core/grid/#aviary.GridConfig"
              showArrow={true}
            >
              GridConfig
            </Link>
            ) und die Pipelines parallel starten.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Welche Koordinatenreferenzsysteme werden bei der Verwendung einer
            Datei unterstützt?
          </AccordionTrigger>
          <AccordionContent>
            Es wird ausschließlich das Koordinatenreferenzsystem EPSG:4326
            (siehe GeoJSON Spezifikation) unterstützt.
            <br />
            Bitte konvertiere deine .geojson-Datei gegebenenfalls entsprechend.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
