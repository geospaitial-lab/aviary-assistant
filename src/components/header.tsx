"use client"

import * as React from "react"

import { Menu, X } from "lucide-react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"

import { AviaryAssistantButton } from "@/components/aviary-assistant-button"
import { ModeButton } from "@/components/mode-button"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const pathname = usePathname()
  const isAssistantRoute =
    pathname === "/assistant" || pathname === "/aviary-assistant/assistant"

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
  }

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSheetOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 max-w-6xl mx-auto px-4 py-2 bg-background">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <AviaryAssistantButton />
          <Nav className="hidden md:block" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            className={cn("hidden md:block", isAssistantRoute && "md:hidden")}
          >
            <NextLink href="/assistant">Zum Assistant</NextLink>
          </Button>
          <ModeButton />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu aria-hidden="true" />
                <span className="sr-only">Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-64 [&>button.absolute]:hidden">
              <VisuallyHidden>
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
              </VisuallyHidden>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="self-end mr-4 mt-2"
                >
                  <X aria-hidden="true" />
                  <span className="sr-only">Schließen</span>
                </Button>
              </SheetClose>
              <div className="ml-4 mt-8">
                <Nav onLinkClick={handleCloseSheet} orientation="vertical" />
              </div>
              <SheetFooter>
                <div className={cn("mx-auto", isAssistantRoute && "hidden")}>
                  <Button asChild onClick={handleCloseSheet}>
                    <NextLink href="/assistant">Zum Assistant</NextLink>
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
