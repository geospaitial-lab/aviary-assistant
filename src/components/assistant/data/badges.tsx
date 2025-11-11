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
import { Badge } from "@/components/ui/badge"

export function RgbBadge() {
  return <Badge className="font-mono select-none">RGB</Badge>
}

export function CirBadge() {
  return <Badge className="font-mono select-none">CIR</Badge>
}

export function NirBadge() {
  return <Badge className="font-mono select-none">NIR</Badge>
}

export function RgbiBadge() {
  return <Badge className="font-mono select-none">RGBI</Badge>
}

export function DomBadge() {
  return <Badge className="font-mono select-none">DOM</Badge>
}

export function WmsBadge() {
  return <Badge className="font-mono select-none">WMS</Badge>
}

export function VrtBadge() {
  return <Badge className="font-mono select-none">VRT</Badge>
}

export interface ChannelsBadgeProps {
  channels: "rgb" | "cir" | "nir" | "rgbi" | "dom"
}

export function ChannelsBadge({ channels }: ChannelsBadgeProps) {
  const channelsMap = {
    rgb: <RgbBadge />,
    cir: <CirBadge />,
    nir: <NirBadge />,
    rgbi: <RgbiBadge />,
    dom: <DomBadge />,
  }

  return channelsMap[channels]
}

export interface TypeBadgeProps {
  type: "wms" | "vrt"
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const typeMap = {
    wms: <WmsBadge />,
    vrt: <VrtBadge />,
  }

  return typeMap[type]
}
