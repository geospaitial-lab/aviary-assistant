/*
 * Copyright (C) 2025-2026 Marius Maryniak
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
import { Terminal } from "lucide-react"

import { CodeBlock } from "@/components/code-block"
import { Link } from "@/components/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const CREATE_VENV_PIP = "python -m venv venv"

const CREATE_VENV_UV = "uv venv venv --python 3.12"

const ACTIVATE_VENV = {
  "Linux und macOS": "source venv/bin/activate",
  Windows: "venv\\Scripts\\activate",
}

const INSTALL_PIP_CPU =
  "pip install geospaitial-lab-aviary[cli] geospaitial-lab-aviary-models[sursentia] torch"

const INSTALL_PIP_GPU =
  "pip install geospaitial-lab-aviary[cli] geospaitial-lab-aviary-models[sursentia] torch --index-url https://download.pytorch.org/whl/cu130"

const INSTALL_UV_CPU =
  "uv pip install geospaitial-lab-aviary[cli] geospaitial-lab-aviary-models[sursentia] torch"

const INSTALL_UV_GPU =
  "uv pip install geospaitial-lab-aviary[cli] geospaitial-lab-aviary-models[sursentia] torch --index-url https://download.pytorch.org/whl/cu130"

const VALIDATE = "aviary plugins"

export function Anleitungen() {
  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">
          Anleitungen
        </h2>

        <div className="text-lg font-semibold text-muted-foreground mb-8">
          <p>
            Um die Pipeline auszuführen, musst du{" "}
            <Link
              href="https://github.com/geospaitial-lab/aviary"
              showArrow={true}
              className="hover:text-foreground"
            >
              aviary
            </Link>{" "}
            auf deiner Maschine installieren – dazu hast du zwei Möglichkeiten.
          </p>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="pip">
            <AccordionTrigger>aviary mit pip installieren</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-8">
                <div>
                  <div className="font-semibold mb-2">Umgebung einrichten</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Installiere zuerst{" "}
                    <Link
                      href="https://www.python.org"
                      showArrow
                      className="hover:text-foreground"
                    >
                      Python 3.12
                    </Link>{" "}
                    – falls noch nicht vorhanden – und erstelle eine virtuelle
                    Umgebung.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={CREATE_VENV_PIP}
                    language="cli"
                  />
                  <p className="text-sm text-muted-foreground my-4">
                    Aktiviere die virtuelle Umgebung.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={ACTIVATE_VENV}
                    language="cli"
                  />
                </div>

                <div>
                  <div className="font-semibold mb-2">Pakete installieren</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Installiere die Pakete in der virtuellen Umgebung.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={INSTALL_PIP_CPU}
                    language="cli"
                  />
                  <p className="text-sm text-muted-foreground my-4">
                    Wenn du eine GPU verwenden willst, musst du eine passende
                    CUDA-Version angeben – weitere Informationen findest du auf{" "}
                    <Link
                      href="https://pytorch.org/get-started/locally"
                      showArrow
                      className="hover:text-foreground"
                    >
                      PyTorch
                    </Link>
                    .
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={INSTALL_PIP_GPU}
                    language="cli"
                  />
                </div>

                <div>
                  <div className="font-semibold mb-2">Testen</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prüfe, ob die Installation erfolgreich war.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={VALIDATE}
                    language="cli"
                  />
                  <p className="text-sm text-muted-foreground my-4">
                    Du solltest nun eine Auflistung der Plugins – darunter auch
                    Sursentia – in deinem Terminal sehen.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="uv">
            <AccordionTrigger>aviary mit uv installieren</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-8">
                <div>
                  <div className="font-semibold mb-2">Umgebung einrichten</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Installiere zuerst{" "}
                    <Link
                      href="https://docs.astral.sh/uv"
                      showArrow
                      className="hover:text-foreground"
                    >
                      uv
                    </Link>{" "}
                    – falls noch nicht vorhanden – und erstelle eine virtuelle
                    Umgebung.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={CREATE_VENV_UV}
                    language="cli"
                  />
                  <p className="text-sm text-muted-foreground my-4">
                    Aktiviere die virtuelle Umgebung.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={ACTIVATE_VENV}
                    language="cli"
                  />
                </div>

                <div>
                  <div className="font-semibold mb-2">Pakete installieren</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Installiere die Pakete in der virtuellen Umgebung.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={INSTALL_UV_CPU}
                    language="cli"
                  />
                  <p className="text-sm text-muted-foreground my-4">
                    Wenn du eine GPU verwenden willst, musst du eine passende
                    CUDA-Version angeben – weitere Informationen findest du auf{" "}
                    <Link
                      href="https://pytorch.org/get-started/locally"
                      showArrow
                      className="hover:text-foreground"
                    >
                      PyTorch
                    </Link>
                    .
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={INSTALL_UV_GPU}
                    language="cli"
                  />
                </div>

                <div>
                  <div className="font-semibold mb-2">Testen</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prüfe, ob die Installation erfolgreich war.
                  </p>
                  <CodeBlock
                    title="Terminal"
                    titleIcon={<Terminal aria-hidden="true" />}
                    code={VALIDATE}
                    language="cli"
                  />
                  <p className="text-sm text-muted-foreground my-4">
                    Du solltest nun eine Auflistung der Plugins – darunter auch
                    Sursentia – in deinem Terminal sehen.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
