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

const UP_SCROLL_THRESHOLD = 32
const DOWN_SCROLL_THRESHOLD = 32
const TOP_POSITION_THRESHOLD = 8

export interface ScrollDirectionOptions {
  upScrollThreshold?: number
  downScrollThreshold?: number
  topPositionThreshold?: number
}

export function useScrollDirection(options: ScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = React.useState<
    "up" | "down" | null
  >(null)
  const [prevScrollY, setPrevScrollY] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(true)
  const [upScrollDistance, setUpScrollDistance] = React.useState(0)
  const [downScrollDistance, setDownScrollDistance] = React.useState(0)
  const {
    upScrollThreshold = UP_SCROLL_THRESHOLD,
    downScrollThreshold = DOWN_SCROLL_THRESHOLD,
    topPositionThreshold = TOP_POSITION_THRESHOLD,
  } = options

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= topPositionThreshold) {
        setIsVisible(true)
        setUpScrollDistance(0)
        setDownScrollDistance(0)
        setPrevScrollY(currentScrollY)
        return
      }

      const isScrollingDown = currentScrollY > prevScrollY
      const isScrollingUp = currentScrollY < prevScrollY

      if (isScrollingDown) {
        handleDownScroll(currentScrollY)
      } else if (isScrollingUp) {
        handleUpScroll(currentScrollY)
      }

      setPrevScrollY(currentScrollY)
    }

    const handleDownScroll = (currentScrollY: number) => {
      const distance = currentScrollY - prevScrollY
      const newDownScrollDistance = downScrollDistance + distance

      setDownScrollDistance(newDownScrollDistance)
      if (scrollDirection !== "down") {
        setScrollDirection("down")
      }

      setUpScrollDistance(0)

      if (newDownScrollDistance >= downScrollThreshold) {
        setIsVisible(false)
        setDownScrollDistance(0)
      }
    }

    const handleUpScroll = (currentScrollY: number) => {
      const distance = prevScrollY - currentScrollY
      const newUpScrollDistance = upScrollDistance + distance

      setUpScrollDistance(newUpScrollDistance)
      if (scrollDirection !== "up") {
        setScrollDirection("up")
      }

      if (newUpScrollDistance >= upScrollThreshold) {
        setIsVisible(true)
        setUpScrollDistance(0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [
    scrollDirection,
    prevScrollY,
    upScrollDistance,
    upScrollThreshold,
    downScrollDistance,
    downScrollThreshold,
    topPositionThreshold,
  ])

  return { isVisible, scrollDirection }
}
