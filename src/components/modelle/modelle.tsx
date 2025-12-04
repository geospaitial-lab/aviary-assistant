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

export function Modelle() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const imageSrc = `${basePath}/images/sursentia.webp`

  return (
    <div className="@container">
      <div className="@2xl:w-2/3 @2xl:mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">
          Modelle
        </h2>
      </div>

      <div className="flex flex-col @2xl:flex-row @2xl:items-center gap-4">
        <div className="order-2 @2xl:order-1 @2xl:w-1/2">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg">
            <img
              src={imageSrc}
              alt="Sursentia-Modelle"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="flex-1 order-1 @2xl:order-2">
          <p className="text-lg font-semibold text-muted-foreground mb-8">
            Die Sursentia-Modelle basieren auf einem Foundation-Model und wurden
            auf einem Datensatz mit Luftbildern aus ganz Deutschland trainiert –
            das macht die Modelle robust.
            <br />
            Du benötigst RGB-Luftbilder mit einer Bodenauflösung von 0.1 oder
            0.2 m/px.
          </p>
          <p className="text-lg font-semibold mb-2">Sursentia Landcover</p>
          <p className="text-sm text-muted-foreground mb-4">
            Erkennt Gebäude, Gründächer, versiegelte Flächen, nicht versiegelte
            Flächen und Gewässer.
          </p>
          <p className="text-lg font-semibold mb-2">Sursentia Solar</p>
          <p className="text-sm text-muted-foreground mb-4">
            Erkennt Solaranlagen.
          </p>
        </div>
      </div>
    </div>
  )
}
