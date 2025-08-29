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
  data: "wms" | "vrt"
}

export function DataBadge({ data }: DataBadgeProps) {
  const dataMap = {
    wms: <WmsBadge />,
    vrt: <VrtBadge />,
  }

  return dataMap[data]
}
