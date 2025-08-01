"use client"

import { useEffect, useState } from "react"

import { Construction } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DevAlert() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenAlert = localStorage.getItem("devAlertSeen")

    if (!hasSeenAlert) {
      setIsOpen(true)
    }
  }, [])

  const handleContinue = () => {
    localStorage.setItem("devAlertSeen", "true")
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Construction aria-hidden="true" />
              Wir arbeiten noch daran
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Im Rahmen von{" "}
            <a
              href="https://urban-ki.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4"
            >
              URBAN.KI
            </a>{" "}
            entsteht ein Assistent zur Konfiguration von{" "}
            <a
              href="https://github.com/geospaitial-lab/aviary"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4"
            >
              aviary
            </a>
            . Die Entwicklung ist noch nicht abgeschlossen – danke für die
            Geduld!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleContinue}>Ok</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
