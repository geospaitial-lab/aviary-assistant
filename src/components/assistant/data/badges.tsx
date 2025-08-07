import { Badge } from "@/components/ui/badge"

export function RgbBadge() {
  return <Badge>RGB</Badge>
}

export function CirBadge() {
  return <Badge>CIR</Badge>
}

export function NirBadge() {
  return <Badge>NIR</Badge>
}

export function RgbiBadge() {
  return <Badge>RGBI</Badge>
}

export function DomBadge() {
  return <Badge>DOM</Badge>
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
