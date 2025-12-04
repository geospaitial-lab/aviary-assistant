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

export function Footer() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <footer className="@container py-16">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-16 @2xl:flex-row @2xl:justify-between">
            {/*
            <div className="grid grid-rows-2 grid-cols-2 grid-flow-col gap-4 @2xl:grid-rows-1 @2xl:grid-cols-4 @2xl:grid-flow-row">
            */}
            <div className="grid grid-cols-2 gap-4 @2xl:grid-cols-2">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-muted-foreground">aviary</h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link
                      href="https://github.com/geospaitial-lab/aviary"
                      className="text-sm"
                      showArrow={true}
                    >
                      Repository
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://geospaitial-lab.github.io/aviary"
                      className="text-sm"
                      showArrow={true}
                    >
                      Docs
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-muted-foreground">Hilfe</h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link href="/anleitungen" className="text-sm">
                      Anleitungen
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/*
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-muted-foreground">Mehr</h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link className="text-sm">Über uns</Link>
                  </li>
                  <li>
                    <Link className="text-sm">Neuigkeiten</Link>
                  </li>
                  <li>
                    <Link className="text-sm">Kontakt</Link>
                  </li>
                </ul>
              </div>
              */}

              {/*
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-muted-foreground">
                  Rechtliches
                </h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link className="text-sm">Impressum</Link>
                  </li>
                  <li>
                    <Link className="text-sm">Datenschutzerklärung</Link>
                  </li>
                  <li>
                    <Link className="text-sm">Nutzungsbedingungen</Link>
                  </li>
                </ul>
              </div>
              */}
            </div>

            <div className="text-2xl text-center @2xl:text-right">
              <span className="font-bold">
                geosp<span className="text-success">ai</span>tial
              </span>
              <span className="@2xl:block"> lab</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[0.625rem] text-muted-foreground">
              © {new Date().getFullYear()} geospaitial lab
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
