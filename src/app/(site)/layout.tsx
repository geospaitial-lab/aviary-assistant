import * as React from "react"

import { CircleX } from "lucide-react"

import "@/app/globals.css"
import { DevBanner } from "@/components/dev-banner"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster
        icons={{
          error: (
            <CircleX className="size-4 text-destructive" aria-hidden="true" />
          ),
        }}
      />
      <DevBanner />
      <Header />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 mb-32">{children}</main>
      </div>
      <Footer />
    </>
  )
}
