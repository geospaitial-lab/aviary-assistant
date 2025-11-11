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
import NextLink from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuLinkStyle,
} from "@/components/ui/navigation-menu"
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu"

interface NavProps extends NavigationMenuProps {
  onLinkClick?: () => void
}

export function Nav({ onLinkClick, ...props }: NavProps) {
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuLinkStyle()} asChild>
            <NextLink href="/" onClick={onLinkClick}>
              Wie es funktioniert
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuLinkStyle()} asChild>
            <NextLink href="/" onClick={onLinkClick}>
              Modelle
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuLinkStyle()} asChild>
            <NextLink href="/" onClick={onLinkClick}>
              Anleitungen
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
