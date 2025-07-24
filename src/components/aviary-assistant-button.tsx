import NextLink from "next/link"

import { AviaryIcon } from "@/components/aviary-icon"
import { Button } from "@/components/ui/button"

export function AviaryAssistantButton() {
  return (
    <Button variant="link" asChild>
      <NextLink href="/">
        <AviaryIcon className="size-8" aria-hidden="true" />
        <span className="sr-only">Startseite</span>
      </NextLink>
    </Button>
  )
}
