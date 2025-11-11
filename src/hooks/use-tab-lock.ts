"use client"

/*
 * Copyright (C) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import * as React from "react"

const CHANNEL_NAME = "aviary-assistant-tab-lock"

export function useTabLock() {
  const [hasLock, setHasLock] = React.useState(false)
  const [isLocked, setIsLocked] = React.useState(false)
  const channelRef = React.useRef<BroadcastChannel | null>(null)
  const tabIdRef = React.useRef<string>(Date.now().toString())

  React.useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      setHasLock(true)
      return
    }

    const tabId = tabIdRef.current
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel

    channel.postMessage({ type: "REQUEST_LOCK", tabId })

    channel.onmessage = (event) => {
      const { type, tabId: senderTabId, hasActiveLock } = event.data

      if (type === "REQUEST_LOCK" && hasLock) {
        channel.postMessage({
          type: "LOCK_RESPONSE",
          tabId,
          hasActiveLock: true,
        })
      } else if (
        type === "LOCK_RESPONSE" &&
        hasActiveLock &&
        senderTabId !== tabId
      ) {
        setIsLocked(true)
        setHasLock(false)
      }
    }

    const lockTimeout = setTimeout(() => {
      if (!isLocked) {
        setHasLock(true)
      }
    }, 100)

    return () => {
      clearTimeout(lockTimeout)
      if (hasLock && channel) {
        channel.postMessage({ type: "RELEASE_LOCK", tabId })
      }
      channel.close()
    }
  }, [hasLock, isLocked])

  return { hasLock, isLocked }
}
