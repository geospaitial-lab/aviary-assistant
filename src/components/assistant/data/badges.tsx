import { Badge } from "@/components/ui/badge"

export function RgbBadge() {
  return <Badge className="font-mono">RGB</Badge>
}

export function CirBadge() {
  return <Badge className="font-mono">CIR</Badge>
}

export function NirBadge() {
  return <Badge className="font-mono">NIR</Badge>
}

export function RgbiBadge() {
  return <Badge className="font-mono">RGBI</Badge>
}

export function DomBadge() {
  return <Badge className="font-mono">DOM</Badge>
}

export function VrtBadge() {
  return <Badge className="font-mono">VRT</Badge>
}

export function WmsBadge() {
  return <Badge className="font-mono">WMS</Badge>
}

export interface ChannelBadgeProps {
  channel: "rgb" | "cir" | "nir" | "rgbi" | "dom"
}

export function ChannelBadge({ channel }: ChannelBadgeProps) {
  const channelMap = {
    rgb: <RgbBadge />,
    cir: <CirBadge />,
    nir: <NirBadge />,
    rgbi: <RgbiBadge />,
    dom: <DomBadge />,
  }

  return channelMap[channel]
}

export interface DataBadgeProps {
  data: "vrt" | "wms"
}

export function DataBadge({ data }: DataBadgeProps) {
  const dataMap = {
    vrt: <VrtBadge />,
    wms: <WmsBadge />,
  }

  return dataMap[data]
}
