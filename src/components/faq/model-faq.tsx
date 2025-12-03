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

export function ModelFaq() {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tighter mb-2" id="modelle">
        Modelle
      </h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Brauche ich mehr Rechenleistung, wenn ich beide Modelle auswähle?
          </AccordionTrigger>
          <AccordionContent>
            Die Ausführung der Modelle erfolgt sequentiell – es ist keine
            zusätzliche Rechenleistung nötig, die Laufzeit verlängert sich
            lediglich.
            <br />
            Gemeinsame Berechnungen werden dabei sogar geteilt. Daher ist die
            Gesamtdauer kürzer, als wenn du zwei Pipelines mit je einem Modell
            starten würdest.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
