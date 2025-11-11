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

import { ArrowRight, ArrowUpRight } from "lucide-react"
import NextLink from "next/link"

import { cn } from "@/lib/utils"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  showArrow?: boolean
  showUnderline?: boolean
  openInNewTab?: boolean
}

export function Link({
  href,
  children,
  className,
  target,
  rel,
  showArrow = false,
  showUnderline = false,
  openInNewTab = false,
  ...props
}: LinkProps) {
  const isExternal = href?.startsWith("http") || href?.startsWith("mailto:")

  const newTabProps = {
    target: target || "_blank",
    rel: rel || "noopener noreferrer",
  }

  const linkProps = isExternal || openInNewTab ? newTabProps : {}

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
    showUnderline && "underline underline-offset-4",
    className,
  )

  if (isExternal) {
    return (
      <a href={href || "#"} className={linkClassName} {...linkProps} {...props}>
        {linkContent}
      </a>
    )
  }

  return (
    <NextLink
      href={href || "/"}
      className={linkClassName}
      {...linkProps}
      {...props}
    >
      {linkContent}
    </NextLink>
  )
}
