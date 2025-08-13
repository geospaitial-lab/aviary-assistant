"use client"

import * as React from "react"

import { CircleAlert } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AlreadyOpenAlert() {
  const router = useRouter()

  const handleToHome = () => {
    router.push("/")
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <CircleAlert aria-hidden="true" />
              Session gefunden
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Du hast bereits eine Session mit dem Assistant geöffnet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleToHome}>
            Zur Startseite
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
