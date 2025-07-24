"use client"

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
