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

export function DataFaq() {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tighter mb-2" id="daten">
        Daten
      </h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Werden andere Bodenauflösungen unterstützt?
          </AccordionTrigger>
          <AccordionContent>
            Falls deine Datenquelle eine andere Bodenauflösung als 0.1, 0.2, 0.5
            oder 1.0 m/px hat, werden die Daten automatisch auf die von dir
            eingestellte Bodenauflösung resampled. Achte dabei darauf, keine
            höhere Bodenauflösung als die deiner Datenquelle zu wählen.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Wo kann ich den Pfad bei der Verwendung einer .vrt-Datei nachtragen?
          </AccordionTrigger>
          <AccordionContent>
            Du kannst den Pfad später direkt in die Konfigurationsdatei
            eintragen oder{" "}
            <code className="font-mono text-sm font-bold">--set</code> beim
            Starten der Pipeline nutzen (siehe{" "}
            <Link
              href="https://geospaitial-lab.github.io/aviary/cli_reference/aviary_pipeline/pipeline_run"
              showArrow={true}
            >
              <code className="font-mono text-sm font-bold">pipeline run</code>
            </Link>
            ).
            <br />
            Am Ende des Assistant wird das genau beschrieben.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
