import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="max-w-6xl px-4">
        <h1 className="text-3xl font-bold tracking-tighter text-balance mb-2">
          Hier gibt's leider nichts zu sehen.
        </h1>
        <p className="text-lg font-semibold text-muted-foreground text-balance mb-8">
          Die von dir aufgerufene Seite existiert nicht – oder nicht mehr.
          <br />
          Bitte überprüfe den Link oder gehe zurück zur Startseite.
        </p>
        <Button asChild>
          <NextLink href="/">Zur Startseite</NextLink>
        </Button>
      </div>
    </div>
  )
}
