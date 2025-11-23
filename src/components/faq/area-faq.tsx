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
