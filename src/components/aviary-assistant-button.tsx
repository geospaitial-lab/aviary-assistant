import NextLink from "next/link"

import { AviaryIcon } from "@/components/aviary-icon"
import { Button } from "@/components/ui/button"

export function AviaryAssistantButton() {
  return (
    <Button asChild variant="link">
      <NextLink href="/">
        <AviaryIcon className="size-10 text-foreground" aria-hidden="true" />
        <span className="sr-only">Startseite</span>
      </NextLink>
    </Button>
  )
}
