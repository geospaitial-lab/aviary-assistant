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

export function PostprocessingFaq() {
  return (
    <div>
      <h2
        className="text-xl font-bold tracking-tighter mb-2"
        id="nachverarbeitung"
      >
        Nachverarbeitung
      </h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Was bedeuten die Auswahlmöglichkeiten beim Sieben und Füllen?
          </AccordionTrigger>
          <AccordionContent>
            Der Schwellenwert für das Sieben und Füllen ist abhängig von der
            Bodenauflösung der Daten:
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>schwach: TODO m²</li>
              <li>moderat: TODO m²</li>
              <li>stark: TODO m²</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Wie funktioniert das Vereinfachen?
          </AccordionTrigger>
          <AccordionContent>
            Die Polygone der Ausgabe werden mit dem
            Visvalingam-Whyatt-Algorithmus vereinfacht. Dabei werden die
            Stützpunkte entfernt, die die Form nur minimal beeinflussen.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
