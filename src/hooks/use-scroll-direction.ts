import * as React from "react"

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = React.useState<
    "up" | "down" | null
  >(null)
  const [prevScrollY, setPrevScrollY] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 32) {
        setIsVisible(true)
        setScrollDirection(null)
        setPrevScrollY(currentScrollY)
        return
      }

      if (currentScrollY > prevScrollY) {
        if (scrollDirection !== "down") {
          setScrollDirection("down")
          setIsVisible(false)
        }
      } else if (currentScrollY < prevScrollY) {
        if (scrollDirection !== "up") {
          setScrollDirection("up")
          setIsVisible(true)
        }
      }

      setPrevScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrollDirection, prevScrollY])

  return { isVisible, scrollDirection }
}
