import * as React from "react"

const UP_SCROLL_THRESHOLD = 32
const DOWN_SCROLL_THRESHOLD = 32

export interface ScrollDirectionOptions {
  upScrollThreshold?: number
  downScrollThreshold?: number
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
  } = options

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
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
  ])

  return { isVisible, scrollDirection }
}
