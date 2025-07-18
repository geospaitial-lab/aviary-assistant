"use client"

import { Link } from "@/components/link"

export function Footer() {
  return (
    <div className="border-t-2">
      <div className="w-full max-w-6xl mx-auto px-4">
        <footer className="@container py-16">
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-16 @4xl:flex-row @4xl:justify-between">
              <div className="grid grid-rows-2 grid-cols-2 grid-flow-col gap-4 @2xl:grid-rows-1 @2xl:grid-cols-4 @2xl:grid-flow-row">
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
                      <Link className="text-sm">FAQ</Link>
                    </li>
                    <li>
                      <Link className="text-sm">Community</Link>
                    </li>
                    <li>
                      <Link className="text-sm">Kontakt</Link>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-medium text-muted-foreground">Mehr</h3>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link className="text-sm">Über uns</Link>
                    </li>
                    <li>
                      <Link className="text-sm">Neuigkeiten</Link>
                    </li>
                  </ul>
                </div>

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
              </div>

              <div className="text-2xl text-center @4xl:text-right">
                <span className="font-bold">
                  geosp<span className="text-success">ai</span>tial
                </span>
                <span className="@4xl:block"> lab</span>
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
    </div>
  )
}
