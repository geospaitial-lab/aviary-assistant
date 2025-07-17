"use client"

import * as React from "react"

import { ArrowRight, ArrowUpRight } from "lucide-react"
import NextLink from "next/link"

import { cn } from "@/lib/utils"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  showArrow?: boolean
  showUnderline?: boolean
}

export function Link({
  href,
  children,
  className,
  target,
  rel,
  showArrow = false,
  showUnderline = false,
  ...props
}: LinkProps) {
  const isExternal = href?.startsWith("http") || href?.startsWith("mailto:")

  const externalProps = isExternal
    ? {
        target: target || "_blank",
        rel: rel || "noopener noreferrer",
      }
    : {}

  const linkContent = (
    <>
      {children}
      {showArrow &&
        (isExternal ? (
          <>
            <ArrowUpRight size="1em" aria-hidden="true" />
            <span className="sr-only">(externer Link)</span>
          </>
        ) : (
          <ArrowRight size="1em" aria-hidden="true" />
        ))}
    </>
  )

  const linkClassName = cn(
    "inline-flex items-center gap-1 cursor-pointer hover:text-muted-foreground transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-sm",
    showUnderline && "underline",
    className,
  )

  if (isExternal) {
    return (
      <a
        href={href || "#"}
        className={linkClassName}
        {...externalProps}
        {...props}
      >
        {linkContent}
      </a>
    )
  }

  return (
    <NextLink href={href || "/"} className={linkClassName} {...props}>
      {linkContent}
    </NextLink>
  )
}
