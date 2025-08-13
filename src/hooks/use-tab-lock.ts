"use client"

import * as React from "react"

const LOCK_KEY = "tab-lock"

export function useTabLock() {
  const [hasLock, setHasLock] = React.useState(false)
  const [isLocked, setIsLocked] = React.useState(false)

  React.useEffect(() => {
    const tabId = Date.now().toString()

    const existingLock = localStorage.getItem(LOCK_KEY)

    if (existingLock && existingLock !== tabId) {
      setIsLocked(true)
      return
    }

    localStorage.setItem(LOCK_KEY, tabId)
    setHasLock(true)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCK_KEY && e.newValue !== tabId) {
        setIsLocked(true)
      }
    }

    window.addEventListener("storage", handleStorage)

    const cleanup = () => {
      if (localStorage.getItem(LOCK_KEY) === tabId) {
        localStorage.removeItem(LOCK_KEY)
      }
    }
    window.addEventListener("beforeunload", cleanup)

    return () => {
      cleanup()
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("beforeunload", cleanup)
    }
  }, [])

  return { hasLock, isLocked }
}
